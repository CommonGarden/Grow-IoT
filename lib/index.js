import Thing from 'Thing.js';
import writeChangesToState from './state'

const _ = require('underscore');
const assert = require('assert');
const util = require('util');
const Duplex = require('stream').Duplex;
const RSVP = require('rsvp');
const later = require('later');
const DDPClient = require('ddp');
const EJSON = require('ddp-ejson');
const Readable = require('stream').Readable;
const Writable = require('stream').Writable;

// Use local time.
later.date.localTime();

/**
 * Constructs a new grow instance, connects to the Grow-IoT server specified in the config
   (default localhost:3000), registers the device with the Server (if it's the first time connecting it saves a new
   uuid and token), and sets up readable and writable streams.
 * @constructor
 * @param {Object} config  
 * @param {Function} callback  An optional callback.
 * @return     A new grow instance.
 */
class Grow {
  constructor(config, callback) {
    this.thing = new Thing(config);
    
    Duplex.call(this, _.defaults(config, {objectMode: true, readableObjectMode: true, writableObjectMode: true}));

    this._messageHandlerInstalled = false;

    this.writeChangesToState = writeChangesToState;

    try {
      // We need the methods defined in the config, so we _.extend state.json.
      var state = require('./state.json');
      _.extend(this, state);
    } catch (err) {
      this.uuid = this.thing.uuid || null;
      this.token = this.thing.token || null;
    }

    this.ddpclient = new DDPClient(_.defaults(config, {
      host: 'localhost',
      port: 3000,
      ssl: false,
      maintainCollections: false
    }));

    this.ddpclient.connect((error, wasReconnect) => {
      if (error) return callback(error);

      if (wasReconnect) {
        console.log('Reestablishment of a Grow server connection.');
      } else {
        console.log('Grow server connection established.');
      }

      if (this.uuid || this.token) {
        return this._afterConnect(callback, {
          uuid: this.uuid,
          token: this.token
        });
      }

      // console.log(JSON.stringify(this.config));
      // Break this out
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

          this._afterConnect(callback, result);
        }
      );
    });
  }

  /*
  * Runs imediately after a successful connection. Makes sure a UUID and token are set.
  */
  _afterConnect(callback, result) {

    this.ddpclient.subscribe(
      'Device.messages',
      [{uuid: this.uuid, token: this.token}],
      (error) => {
        if (error) return callback(error);

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

    this.readableStream.on('error', function (error) {
      console.log('Error', error.message);
    });

    // Writable stream: this is writable from the server perspective. A device listens on
    // the writable stream to recieve new commands.
    this.writableStream = new Writable({objectMode: true});

    // These should register reguardless of whether device connects.
    var actionsRegistered = new RSVP.Promise((resolve, reject) => {
      try {
        resolve(this.registerActions());
      }
      catch (error) {
        reject(error);
      }
    });

    actionsRegistered.then((value)=> {
      this.pipe(this.writableStream);
      this.readableStream.pipe(this);

      if (!_.isUndefined(callback)) {
        callback(null, self);
      }
    });
  }

  /*
   * On _write, call API.sendData()
   */
  _write(chunk, encoding, callback) {
    this.sendData(chunk, callback);
  }

  /*
   * We are pushing data to a stream as commands are arriving and are leaving
     to the stream to buffer them. So we simply ignore requests for more data.
   */
  _read(size) {}

  /*
   * Sets up listening for actions on the writeable stream. Note: writable from
     the server's perspective.
   */
  registerActions () {
    this.writableStream._write = (command, encoding, callback) => {
      if (command.options) {
        this.thing.callAction(command.type, command.options);
      } else {
        this.thing.callAction(command.type);
      }

      callback(null);
    };
  }

  /**
   * Send data to Grow-IoT server.
   * @param      {Object}  data
   * @param      {Function} callback
   */
  sendData (data, callback) {
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
   * @param      {Object}  event
   * @param      {Function} callback
   */
  emitEvent (eventMessage, callback) {
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

  /*
   * Update device property on Grow-IoT server.
   * @param {String} componentName  Name of the component you want to update.
   * @param {String} propertyKey  Name of the of the property you wish to update
   * @param {Object|List|String|Number|Boolean} value The new value to set the property to.
   * @param {Function} callback  An optional callback.
   */
  updateProperty(componentID, property, value, callback) {
    // Update the thing property.
    this.thing.updateProperty(componentID, property, value);

    this.writeChangesToState();

    this.ddpclient.call(
      'Device.udpateProperty',
      [{uuid: this.uuid, token: this.token}, componentID, property, value],
      function (error, result) {
        if (!_.isUndefined(callback)) {
          callback(error, result);
        }
      }
    );
  }
};

util.inherits(Grow, Duplex);

export default Grow;
