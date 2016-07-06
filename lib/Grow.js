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
    // XXX: this needs to be rewritten...
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

    this.scheduled = {};

    /**
     * Starts a reoccurring action or event if a schedule property is defined.
     * @param {Object} key  An action or event object.
    */
    this.schedule = (key) => {
      // XXX: what if they both have the same key?
      // console.log(key);
      let action = this.thing.getAction(key);
      let event = this.thing.getEvent(key);
      if (action) {
        let schedule = later.parse.text(action.schedule);
        let scheduledAction = later.setInterval(()=> {this.call(key);}, schedule);
        return this.scheduled[key] = scheduledAction;
      } else if (event) {
        let schedule = later.parse.text(event.schedule);
        let scheduledEvent = later.setInterval(()=> {this.call(key);}, schedule);
        return this.scheduled[key] = scheduledEvent;
      }
    }

    // Start any scheduled actions or events.
    // TODO: test!
    if (!_.isUndefined(this.thing.actions)) {
      _.each(this.thing.actions, (action, key, list) => {
        if (!_.isUndefined(action.schedule)) {
          this.schedule(key);
        }
      });
    }

    if (!_.isUndefined(this.thing.events)) {
      _.each(this.thing.events, (event, key, list) => {
        if (!_.isUndefined(event.schedule)) {
          this.schedule(key);
        }
      });
    }

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

      // Test new getTime method...
      this.ddpclient.call(
        'Device.getTime',
        [{uuid: this.uuid, token: this.token}],
        (error, result) => {
          if (error) {
            if (!_.isUndefined(callback)) {
              return callback(error);
            } else { console.log(error); }
          }
          console.log(result)
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
        let opts = command.options;
        let type = command.type;
        if (type === 'setProperty') {
          this.set(opts.property, opts.value, opts.key);
        } else if (opts) {
          this.thing.call(type, opts);
        } else {
          this.thing.call(type);
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
     * @return  this
     */
    this.log = (data, callback) => {
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

      return this;
    }

    /**
     * Emit device event to Grow-IoT server.
     * @param {Object}  event  The event to emit
     * @param {Function} callback  Optional callback
     * @return  this
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

      return this;
    }

    /**
     * Calls thing.call and emits an event to Grow-IoT.
     * @param {String} key  key of the action you want to call.
     * @param {Object|List|String|Number|Boolean} options The new value to set the property to.
     * @return  this
     */
    this.call = (key, options) => {
      let action = this.thing.getAction(key);
      
      // If action disabled... we don't call it...
      if (!action.disable) {
        this.thing.call(key, options);

        // Check to see if action has an event message
        if (!_.isUndefined(action.event)) {
          this.emitEvent(action.event);
        } else {
          this.emitEvent(key);
        }

      }
      return this;
    }


    /**
     * Update device property on Grow-IoT server.
     * @param {String} property  Name of the of the property you wish to update
     * @param {Object|List|String|Number|Boolean} value The new value to set the property to.
     * @param {String} key  Optional. Use if you want to set an event or action property.
     * @param {Function} callback  An optional callback.
     * @return  this
     */
    this.set = (property, value, key, callback) => {
      // Update the thing property.
      this.thing.set(property, value, key);

      this.writeChangesToState();

      // If the property being updated is the schedule property, restart the scheduled action.
      if (property === 'schedule') {
        this.scheduled[key].clear();
        this.schedule(key);
      }

      this.ddpclient.call(
        'Device.setProperty',
        [{uuid: this.uuid, token: this.token}, property, value, key],
        function (error, result) {
          if (!_.isUndefined(callback)) {
            callback(error, result);
          }
        }
      );

      return this;
    }

    /**
     * Update device property on Grow-IoT server.
     * @param {String} property  Name of the of the property you wish to update
     * @param {String} key  Optional. Use if you want to get an event or action property.
    */
    this.get = (property, key) => {
      // Update the thing property.
      return this.thing.get(property, key);
    }

    if (!_.isUndefined(callback)) {
      callback();
    }
  }
};

util.inherits(Grow, Duplex);

export default Grow;
