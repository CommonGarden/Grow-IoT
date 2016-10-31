const Thing = require('Thing.js');
const _ = require('underscore');
const assert = require('assert');
const util = require('util');
const DDPClient = require('ddp');
const EJSON = require('ddp-ejson');
const fs = require('fs');
const stringify = require('json-stringify-safe');

/**
 * Class representing a new grow instance: connects to the Grow-IoT server specified in the config (default localhost:3000), registers the device with the Server (if it's the first time connecting it saves a new uuid and token), and sets up readable and writable streams.
 * @param {Object} config  The thing configuration object.
 * @return     A new grow instance.
 */
class Grow {
  constructor(config) {
    // Eventually we'll support multiple things...
    // For example, a Raspberry Pi acting as a hub to connect low power sensors
    this.thing = new Thing(config);

    if (!this.thing.uuid && !this.thing.token) {
      new Error('UUID and token are required to connect to a Grow-IoT instance.');
    }

    this._messageHandlerInstalled = false;

    /**
     * Calls thing.call and emits an event to Grow-IoT.
     * @param {String} key  key of the action you want to call.
     * @param {Object|List|String|Number|Boolean} options The new value to set the property to.
     * @return  this
     */
    this.call = (key, options) => {
      let output = this.thing.call(key, options);

      if (!_.isUndefined(output)) {
        return output;
      }
      else {
        return this;
      }
    }

    /**
     * Update thing property
     * @param {String} property  Name of the of the property you wish to update
     * @param {Object|List|String|Number|Boolean} value The new value to set the property to.
     * @param {String} key  Optional. Use if you want to set an event or action property.
     * @return  this
     */
    this.set = (key, value) => {
      this.thing.set(key, value);
      return this;
    }

    /**
     * Get thing property
     * @param {String} key
    */
    this.get = (key) => {
      return this.thing.get(key);
    }
  }

  /**
   * Connects to Grow-IoT server.
   * @param {Object}  options  Connection options
   */
  connect (options) {
    this.ddpclient = new DDPClient(_.defaults(options, {
      host: 'localhost',
      port: 3000,
      ssl: false,
      maintainCollections: false
    }));

    this.ddpclient.connect((error, wasReconnect) => {
      if (error) {
        console.log(error)
      }

      if (wasReconnect) {
        console.log('Reestablishment of a Grow server connection.');
        // Emit reconnected event?
      } else {
        console.log('Grow server connection established.');
        // Emit a connected event?
      }

      this.ddpclient.call(
        'Thing.register',
        [{uuid: this.thing.uuid, token: this.thing.token}, this.thing],
        (error, result) => {
          if (error) {
            console.log(error);
          }

          this.afterConnect(result);
        }
      );
    });

    this.afterConnect = (result) => {
      this.ddpclient.subscribe(
        'Thing.messages',
        [{uuid: this.thing.uuid, token: this.thing.token}],
        (error) => {
          if (error) return console.log(error);

          if (!this._messageHandlerInstalled) {
            this._messageHandlerInstalled = true;

            this.ddpclient.on('message', (data)=> {
              data = EJSON.parse(data);

              if (data.msg !== 'added' || data.collection !== 'Things.messages') {
                return;
              }

              let command = data.fields.body;
              let opts = command.options;
              let type = command.type;
              if (type === 'setProperty') {
                this.thing.set(opts.key, opts.value);
              } else if (opts) {
                this.thing.call(type, opts);
              } else {
                this.thing.call(type);
              }
            });
          }
        }
      );
    };

    /**
     * Emits event to Grow-IoT server.
     * @param {Object}  event  The event to emit
     * @return  this
     */
    this.emit = (eventMessage) => {
      var body = {
        'message': eventMessage
      };
      body.timestamp = new Date();

      this.ddpclient.call(
        'Thing.event',
        [{uuid: this.thing.uuid, token: this.thing.token}, body],
        function (error, result) {
          if (error) {
            console.log(error, result);
          }
        }
      );

      return this;
    }

    /**
     * Update thing property on thing and Grow-IoT server.
     * @param {String} property  Name of the of the property you wish to update
     * @param {Object|List|String|Number|Boolean} value The new value to set the property to.
     * @param {String} key  Optional. Use if you want to set an event or action property.
     * @return  this
     */
    this.set = (key, value) => {
      this.thing.set(key, value);

      if (this.ddpclient) {
        this.ddpclient.call(
          'Thing.setProperty',
          [{uuid: this.thing.uuid, token: this.thing.token}, key, value],
          function (error, result) {
            if (error) {
              console.log(error);
            }
          }
        );
      }

      return this;
    }
  }
};

export default Grow;
