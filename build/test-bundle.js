'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Thing = _interopDefault(require('Thing.js'));

require("source-map-support").install();

var babelHelpers = {};

babelHelpers.classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

babelHelpers.createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

babelHelpers;

global.expect = require('chai').expect;

(function setup() {
  beforeEach(function () {

    // Setup test things
    // In the future we can test multiple different kinds of things!
    global.thing1 = {
      name: 'Light', // The display name for the thing.
      desription: 'An LED light with a basic on/off api.',
      // The username of the account you want this device to be added to.
      username: 'jake2@gmail.com',
      // Properties can be updated by the API
      properties: {
        state: 'off'
      },
      // Actions are the API of the thing.
      actions: {
        turn_light_on: {
          name: 'On', // Display name for the action
          description: 'Turns the light on.', // Optional description
          schedule: 'at 9:00am', // Optional scheduling using later.js
          function: function _function() {
            // The implementation of the action.
            return 'Light on';
          }
        },
        turn_light_off: {
          name: 'off',
          schedule: 'at 8:30pm', // Run this function at 8:30pm
          function: function _function() {
            return 'Light off';
          }
        },
        light_data: {
          name: 'Log light data',
          // type and template need for visualization component... HACK.
          type: 'light',
          template: 'sensor',
          schedule: 'every 1 second',
          function: function _function() {
            return 'light data';
          }
        }
      }
    };
  });

  afterEach(function () {
    delete global.thing1;
  });
})();

var _this = this;

/**
 * Writes any changes to the state.json file. The state.json file is used for state. 
 * In case the device looses internet connnection or power and needs to reset, the grow file contains the instructions such as schedules, where the device is supposed to connect to.
 */

var fs = require('fs');

var writeChangesToState = function writeChangesToState() {
  fs.writeFile('./state.json', JSON.stringify(_this, null, 4), function (error) {
    if (error) return console.log('Error', error);
  });
};

var _ = require('underscore');
var assert = require('assert');
var util = require('util');
var Duplex = require('stream').Duplex;
var RSVP = require('rsvp');
var later = require('meteor-later');
var DDPClient = require('ddp');
var EJSON = require('ddp-ejson');
var Readable = require('stream').Readable;
var Writable = require('stream').Writable;

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

var Grow = function () {
  function Grow(config, callback) {
    var _this = this;

    babelHelpers.classCallCheck(this, Grow);

    this.thing = new Thing(config);

    Duplex.call(this, _.defaults(config, { objectMode: true, readableObjectMode: true, writableObjectMode: true }));

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

    this.ddpclient.connect(function (error, wasReconnect) {
      if (error) return callback(error);

      if (wasReconnect) {
        console.log('Reestablishment of a Grow server connection.');
      } else {
        console.log('Grow server connection established.');
      }

      if (_this.uuid || _this.token) {
        return _this.afterConnect(callback, {
          uuid: _this.uuid,
          token: _this.token
        });
      }

      // console.log(JSON.stringify(this.config));
      // Break this out
      _this.ddpclient.call('Device.register', [config], function (error, result) {
        if (error) {
          if (!_.isUndefined(callback)) {
            return callback(error);
          } else {
            console.log(error);
          }
        }

        assert(result.uuid, result);
        assert(result.token, result);

        _this.uuid = result.uuid;
        _this.token = result.token;

        _this.afterConnect(callback, result);
      });
    });
  }

  /*
  * Runs imediately after a successful connection. Makes sure a UUID and token are set.
  */


  babelHelpers.createClass(Grow, [{
    key: 'afterConnect',
    value: function afterConnect(callback, result) {
      var _this2 = this;

      this.ddpclient.subscribe('Device.messages', [{ uuid: this.uuid, token: this.token }], function (error) {
        if (error) return callback(error);

        if (!_this2._messageHandlerInstalled) {
          _this2._messageHandlerInstalled = true;

          _this2.ddpclient.on('message', function (data) {
            data = EJSON.parse(data);

            if (data.msg !== 'added' || data.collection !== 'Device.messages') {
              return;
            }

            _this2.push(data.fields.body);
          });
        }
      });

      // Now check to see if we have a stored UUID.
      // If no UUID is specified, store a new UUID.
      if (!_.isUndefined(this.uuid) && !_.isUndefined(this.token)) {
        this.writeChangesToState();
      }

      // SETUP STREAMS
      // Readable Stream: this is 'readable' from the server perspective.
      // The device publishes it's data to the readable stream.
      this.readableStream = new Readable({ objectMode: true });

      // We are pushing data when sensor measures it so we do not do anything
      // when we get a request for more data. We just ignore it for now.
      this.readableStream._read = function () {};

      this.readableStream.on('error', function (error) {
        console.log('Error', error.message);
      });

      // Writable stream: this is writable from the server perspective. A device listens on
      // the writable stream to recieve new commands.
      this.writableStream = new Writable({ objectMode: true });

      // These should register reguardless of whether device connects.
      var actionsRegistered = new RSVP.Promise(function (resolve, reject) {
        try {
          resolve(_this2.registerActions());
        } catch (error) {
          reject(error);
        }
      });

      actionsRegistered.then(function (value) {
        _this2.pipe(_this2.writableStream);
        _this2.readableStream.pipe(_this2);

        if (!_.isUndefined(callback)) {
          callback(null, self);
        }
      });
    }

    /*
     * On _write, call API.sendData()
     */

  }, {
    key: '_write',
    value: function _write(chunk, encoding, callback) {
      this.sendData(chunk, callback);
    }

    /*
     * We are pushing data to a stream as commands are arriving and are leaving
       to the stream to buffer them. So we simply ignore requests for more data.
     */

  }, {
    key: '_read',
    value: function _read(size) {}

    /*
     * Sets up listening for actions on the writeable stream. Note: writable from
       the server's perspective.
     */

  }, {
    key: 'registerActions',
    value: function registerActions() {
      var _this3 = this;

      this.writableStream._write = function (command, encoding, callback) {
        if (command.type === 'updateActionSchedule') {
          _this3.updateActionProperty(command.options.actionKey, 'schedule', command.options.newValue);
        } else if (command.options) {
          _this3.thing.callAction(command.type, command.options);
        } else {
          _this3.thing.callAction(command.type);
        }

        callback(null);
      };
    }

    /**
     * Send data to Grow-IoT server.
     * @param      {Object}  data
     * @param      {Function} callback
     */

  }, {
    key: 'sendData',
    value: function sendData(data, callback) {
      if (!this.ddpclient || !this.uuid || !this.token) {
        callback('Invalid connection state.');
        return;
      }

      this.ddpclient.call('Device.sendData', [{ uuid: this.uuid, token: this.token }, data], function (error, result) {
        if (error) console.log(error);

        if (!_.isUndefined(callback)) {
          callback(null, result);
        }
      });
    }

    /**
     * Emit device event to Grow-IoT server.
     * @param      {Object}  event
     * @param      {Function} callback
     */

  }, {
    key: 'emitEvent',
    value: function emitEvent(eventMessage, callback) {
      var body = {
        'message': eventMessage
      };
      body.timestamp = new Date();

      this.ddpclient.call('Device.emitEvent', [{ uuid: this.uuid, token: this.token }, body], function (error, result) {
        if (!_.isUndefined(callback)) {
          callback(error, result);
        }
      });
    }

    /*
     * Calls thing.callAction and emits an event to Grow-IoT.
     * @param {String} actionKey  key of the action you want to call.
     * @param {Object|List|String|Number|Boolean} options The new value to set the property to.
     */

  }, {
    key: 'callAction',
    value: function callAction(actionKey, options) {
      var action = this.thing.getAction(actionKey);
      this.thing.callAction(actionKey, options);

      // Check to see if action has an event message
      if (!_.isUndefined(action.event)) {
        this.emitEvent(action.event);
      } else {
        this.emitEvent(actionKey);
      }
    }
  }, {
    key: 'updateActionProperty',
    value: function updateActionProperty(actionKey, property, value) {
      var action = this.thing.getAction(actionKey);
      action[property] = value;

      // If the property being updated is the schedule property, restart the scheduled action.
      if (property === 'schedule') {
        this.thing.scheduledActions[actionKey].clear();
        this.thing.startAction(actionKey);
      }

      this.ddpclient.call('Device.updateActionProperty', [{ uuid: this.uuid, token: this.token }, actionKey, property, value], function (error, result) {
        if (error) {
          console.log(error);
        }
      });
    }
  }, {
    key: 'updateEventProperty',
    value: function updateEventProperty(eventKey, property, value) {
      var event = this.thing.getEvent(eventKey);
      event[property] = value;

      // If the property being updated is the schedule property, restart the scheduled action.
      if (property === 'schedule') {
        this.thing.scheduledEvents[eventKey].clear();
        this.thing.startEvent(eventKey);
      }

      this.ddpclient.call('Device.updateEventProperty', [{ uuid: this.uuid, token: this.token }, eventKey, property, value], function (error, result) {
        if (error) {
          console.log(error);
        }
      });
    }

    /*
     * Update device property on Grow-IoT server.
     * @param {String} property  Name of the of the property you wish to update
     * @param {Object|List|String|Number|Boolean} value The new value to set the property to.
     * @param {Function} callback  An optional callback.
     */

  }, {
    key: 'setProperty',
    value: function setProperty(property, value, callback) {
      // Update the thing property.
      this.thing.setProperty(property, value);

      // Not working in this version of Grow.js yet.
      this.writeChangesToState();

      this.ddpclient.call('Device.udpateProperty', [{ uuid: this.uuid, token: this.token }, property, value], function (error, result) {
        if (!_.isUndefined(callback)) {
          callback(error, result);
        }
      });
    }
  }]);
  return Grow;
}();

;

util.inherits(Grow, Duplex);

/*
  Basic tests:
  * Events
*/

describe('A feature test', function () {
  it('should have setup actions correctly', function () {
    var GrowInstance = new Grow(thing1);
    expect(GrowInstance.thing.callAction('turn_light_on')).to.equal('Light on');
    expect(GrowInstance.thing.callAction('turn_light_off')).to.equal('Light off');
  });

  it('should have setup actions correctly', function () {
    var GrowInstance = new Grow(thing1);
    GrowInstance.updateActionProperty('turn_light_on', 'schedule', 'at 10:00am');
    console.log(GrowInstance);
  });

  // TODO
  // it('should have setup events correctly', () => {
  //   var GrowInstance = new Grow(thing1);
  //   // expect(thing.constructor).to.have.been.calledOnce;
  // });
});
//# sourceMappingURL=test-bundle.js.map