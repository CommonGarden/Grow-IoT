const Thing = require('Thing.js');
const _ = require('underscore');
const assert = require('assert');
const util = require('util');
const Duplex = require('stream').Duplex;
const RSVP = require('rsvp');
const later = require('meteor-later');
const DDPClient = require('ddp');
const EJSON = require('ddp-ejson');
const Readable = require('stream').Readable;
const Writable = require('stream').Writable;
const fs = require('fs');
const stringify = require('json-stringify-safe');

/**
 * Class representing a new grow instance: connects to the Grow-IoT server specified in the config (default localhost:3000), registers the device with the Server (if it's the first time connecting it saves a new uuid and token), and sets up readable and writable streams.
 * @param {Object} config  The thing configuration object.
 * @param {Function} callback  An optional callback.
 * @return     A new grow instance.
 */
class Grow {
  constructor(config, callback) {
    // Use local time.
    later.date.localTime();

    // TODO: this needs to be rewritten...
    try {
      // HACK: there must be a better way to require state.json
      // This is for when Grow.js is in the node_modules folder.
      var state = require('../../.././state.json');
      console.log('Loading from state.json');
      _.extend(this, state);
    } catch (err) {
      try {
        // When developing...
        var state = require('.././state.json');
        console.log('Loading from state.json');
        _.extend(this, state);
      }
      catch (err) {
        this.uuid = null;
        this.token = null;
      }
    }

    this.thing = new Thing(config);

    Duplex.call(this, _.defaults(config, {objectMode: true, readableObjectMode: true, writableObjectMode: true}));

    this._messageHandlerInstalled = false;

    this.ddpclient = new DDPClient(_.defaults(config, {
      host: 'localhost',
      port: 3000,
      ssl: false,
      maintainCollections: false
    }));

    this.afterConnect = (callback, result) => {
      this.ddpclient.subscribe(
        'Device.messages',
        [{uuid: this.uuid, token: this.token}],
        (error) => {
          if (error) return console.log(error);

          if (!this._messageHandlerInstalled) {
            this._messageHandlerInstalled = true;

            this.ddpclient.on('message', (data)=> {
              data = EJSON.parse(data);

              if (data.msg !== 'added' || data.collection !== 'Device.messages') {
                return;
              }

              this.push(data.fields.body);
            });
          }
        }
      );

      // Now check to see if we have a stored UUID.
      // If no UUID is specified, store a new UUID.
      if (!_.isUndefined(this.uuid) && !_.isUndefined(this.token)) {
        this.writeChangesToState();
      }

      // SETUP STREAMS
      // Readable Stream: this is 'readable' from the server perspective.
      // The device publishes it's data to the readable stream.
      this.readableStream = new Readable({objectMode: true});

      // We are pushing data when sensor measures it so we do not do anything
      // when we get a request for more data. We just ignore it for now.
      this.readableStream._read = function () {};

      
      // We are pushing data to a stream as commands are arriving and are leaving
      // to the stream to buffer them. So we simply ignore requests for more data.
      this._read = (size) => {}

      this.readableStream.on('error', function (error) {
        console.log('Error', error.message);
      });

      // Writable stream: this is writable from the server perspective. A device listens on
      // the writable stream to recieve new commands.
      this.writableStream = new Writable({objectMode: true});

      // Sets up listening for actions on the writeable stream. Note: writable from
      // the server's perspective.
      this.writableStream._write = (command, encoding, callback) => {
        if (command.type === 'updateActionSchedule') {
          this.updateActionProperty(command.options.actionKey, 'schedule', command.options.newValue);
        } else if (command.options) {
          this.thing.callAction(command.type, command.options);
        } else {
          this.thing.callAction(command.type);
        }

        callback(null);
      };

      // On _write, call API.sendData()
      this._write = (chunk, encoding, callback) => {
        this.sendData(chunk, callback);
      }

      // Pipe things.
      this.pipe(this.writableStream);
      this.readableStream.pipe(this);
    };

    this.ddpclient.connect((error, wasReconnect) => {
      if (error) return callback(error);

      if (wasReconnect) {
        console.log('Reestablishment of a Grow server connection.');
      } else {
        console.log('Grow server connection established.');
      }

      if (this.uuid || this.token) {
        return this.afterConnect(callback, {
          uuid: this.uuid,
          token: this.token
        });
      }

      this.ddpclient.call(
        'Device.register',
        [config],
        (error, result) => {
          if (error) {
            if (!_.isUndefined(callback)) {
              return callback(error);
            } else { console.log(error); }
          }

          assert(result.uuid, result);
          assert(result.token, result);

          this.uuid = result.uuid;
          this.token = result.token;

          this.afterConnect(callback, result);
        }
      );
    });

    /**
     * Writes current state to state.json.
     */
    this.writeChangesToState = ()=> {
      fs.writeFile('./state.json', stringify(this, null, 4), function (error) {
        if (error) return console.log('Error', error);
      });
    };
    

    /**
     * Send data to Grow-IoT server.
     * @param {Object} data  Data to log on the server
     * @param {Function} callback  Optional callback
     */
    this.sendData = (data, callback) => {
      if (!this.ddpclient || !this.uuid || !this.token) {
        callback('Invalid connection state.');
        return;
      }

      this.ddpclient.call(
        'Device.sendData',
        [{uuid: this.uuid, token: this.token}, data],
        function (error, result) {
          if (error) console.log(error);

          if (!_.isUndefined(callback)) {
            callback(null, result);
          }
        }
      );
    }

    /**
     * Emit device event to Grow-IoT server.
     * @param {Object}  event  The event to emit
     * @param {Function} callback  Optional callback
     */
    this.emitEvent = (eventMessage, callback) => {
      var body = {
        'message': eventMessage
      };
      body.timestamp = new Date();

      this.ddpclient.call(
        'Device.emitEvent',
        [{uuid: this.uuid, token: this.token}, body],
        function (error, result) {
          if (!_.isUndefined(callback)) {
            callback(error, result);
          }
        }
      );
    }

    /**
     * Calls thing.callAction and emits an event to Grow-IoT.
     * @param {String} actionKey  key of the action you want to call.
     * @param {Object|List|String|Number|Boolean} options The new value to set the property to.
     */
    this.callAction = (actionKey, options) => {
      let action = this.thing.getAction(actionKey);
      this.thing.callAction(actionKey, options);

      // Check to see if action has an event message
      if (!_.isUndefined(action.event)) {
        this.emitEvent(action.event);
      } else {
        this.emitEvent(actionKey);
      }
    }

    /**
     * Update an action property such as schedule or action options.
     * @param {String} actionKey  key of the action you want to update.
     * @param {String} property  the property you want to set.
     * @param {Object|List|String|Number|Boolean} value  the new property value.
     */
    this.updateActionProperty = (actionKey, property, value) => {
      let action = this.thing.getAction(actionKey);
      action[property] = value;

      // If the property being updated is the schedule property, restart the scheduled action.
      if (property === 'schedule') {
        this.thing.scheduledActions[actionKey].clear();
        this.thing.startAction(actionKey);
      }

      this.ddpclient.call(
        'Device.updateActionProperty',
        [{uuid: this.uuid, token: this.token}, actionKey, property, value],
        function (error, result) {
          if (error) {
            console.log(error);
          }
        }
      );
    }

    /**
     * Update an event property such as schedule or options.
     * @param {String} eventKey  key of the event you want to update.
     * @param {String} property  the property you want to set.
     * @param {Object|List|String|Number|Boolean} value  the new property value.
     */
    this.updateEventProperty = (eventKey, property, value) => {
      let event = this.thing.getEvent(eventKey);
      event[property] = value;

      // If the property being updated is the schedule property, restart the scheduled action.
      if (property === 'schedule') {
        this.thing.scheduledEvents[eventKey].clear();
        this.thing.startEvent(eventKey);
      }

      this.ddpclient.call(
        'Device.updateEventProperty',
        [{uuid: this.uuid, token: this.token}, eventKey, property, value],
        function (error, result) {
          if (error) {
            console.log(error);
          }
        }
      );
    }

    /**
     * Update device property on Grow-IoT server.
     * @param {String} property  Name of the of the property you wish to update
     * @param {Object|List|String|Number|Boolean} value The new value to set the property to.
     * @param {Function} callback  An optional callback.
     */
    this.setProperty = (property, value, callback) => {
      // Update the thing property.
      this.thing.setProperty(property, value);

      // Not working in this version of Grow.js yet.
      this.writeChangesToState();

      this.ddpclient.call(
        'Device.udpateProperty',
        [{uuid: this.uuid, token: this.token}, property, value],
        function (error, result) {
          if (!_.isUndefined(callback)) {
            callback(error, result);
          }
        }
      );
    }

    if (!_.isUndefined(callback)) {
      callback();
    }
  }
};

util.inherits(Grow, Duplex);

export default Grow;
