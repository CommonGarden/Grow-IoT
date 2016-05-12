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
      'name': 'Light',
      'description': 'An LED light with a basic on/off api.',
      'state': 'off',
      'actions': [{
        'name': 'On',
        'description': 'Turns the light on.',
        'id': 'turn_light_on',
        'updateState': 'on',
        'schedule': 'at 9:00am',
        'event': 'Light turned on',
        'function': function _function() {
          return 'Light on.';
        }
      }, {
        'name': 'off',
        'id': 'turn_light_off',
        'updateState': 'off',
        'schedule': 'at 8:30pm',
        'event': 'Light turned off',
        'function': function _function() {
          return 'Light off.';
        }
      }],
      'events': [{
        'name': 'Light data',
        'id': 'light_data',
        'type': 'light',
        'schedule': 'every 1 second',
        'function': function _function() {
          return 'data';
        }
      }]
    };
  });

  afterEach(function () {
    delete global.thing1;
  });
})();

// Documentation: https://nodejs.org/api/stream.html
var Readable$2 = require('stream').Readable;
var Writable$2 = require('stream').Writable;

var API = {
  /**
   * Send data to Grow-IoT server.
   * @param      {Object}  data
   * @param      {Function} callback
   */

  sendData: function sendData(data, callback) {
    if (!this.ddpclient || !this.uuid || !this.token) {
      callback("Invalid connection state.");
      return;
    }

    this.ddpclient.call('Device.sendData', [{ uuid: this.uuid, token: this.token }, data], function (error, result) {
      if (error) console.log(error);

      if (!_.isUndefined(callback)) {
        callback(null, result);
      }
    });
  },


  /**
   * Emit device event to Grow-IoT server.
   * @param      {Object}  event
   * @param      {Function} callback
   */
  emitEvent: function emitEvent(eventMessage, callback) {

    var body = eventMessage;
    body.timestamp = new Date();

    this.ddpclient.call('Device.emitEvent', [{ uuid: this.uuid, token: this.token }, body], function (error, result) {
      if (!_.isUndefined(callback)) {
        callback(error, result);
      }
    });
  },


  // TODO: split this into two functions... it sucks.
  /*
   * Update device property on Grow-IoT server.
   * @param {String} componentName  Name of the component you want to update.
   * @param {String} propertyKey  Name of the of the property you wish to update
   * @param {Object|List|String|Number|Boolean} value The new value to set the property to.
   * @param {Function} callback  An optional callback.
   */
  updateProperty: function updateProperty(componentName, propertyKey, value, callback) {

    var thing = this.config;

    // Find properties in top level thing object
    for (var key in thing) {
      // Find properties in components
      if (key === "components") {
        for (var item in thing.components) {
          if (thing.components[item].name === componentName) {
            thing.components[item][propertyKey] = value;
          }
        }
      } else if (thing[key] === componentName) {
        thing[propertyKey] = value;
      }
    }

    this.writeChangesToGrowFile();

    this.ddpclient.call('Device.udpateProperty', [{ uuid: this.uuid, token: this.token }, componentName, propertyKey, value], function (error, result) {
      if (!_.isUndefined(callback)) {
        callback(error, result);
      }
    });
  }
};

/*
SSL is supported though will require a bit more setup. If you are hosting your instance off a computer with a dedicated IP address include the following info in your configuration object.

```json
    "host": "YOUR_IP_HERE",
    "port": 443,
    "ssl": true,
```

If you are hosting on a cloud instance such as [Meteor Galaxy](https://galaxy.meteor.com), you might need specify the servername. The example below shows you how to connect securely to the instance at [grow.commongarden.org](https://grow.commongarden.org):

```json
    "host": "grow.commongarden.org",
    "tlsOpts": {
        "tls": {
            "servername": "galaxy.meteor.com"
        }
    },
    "port": 443,
    "ssl": true,
    "thing": { ... }
```
*/

var _$2 = require('underscore');
var DDPClient$1 = require('ddp');
var EJSON$1 = require("ddp-ejson");

var DDP = {
  connect: function connect(config, callback) {
    this.ddpclient = new DDPClient$1(_$2.defaults(config, {
      host: 'localhost',
      port: 3000,
      ssl: false,
      maintainCollections: false
    }));

    this.ddpclient.connect(function (error, wasReconnect) {
      if (error) return callback(error);

      if (wasReconnect) {
        console.log("Reestablishment of a Grow server connection.");
      } else {
        console.log("Grow server connection established.");
      }

      if (this.uuid || this.token) {
        return this._afterConnect(callback, {
          uuid: this.uuid,
          token: this.token
        });
      }

      // console.log(JSON.stringify(this.config));
      // Break this out
      this.ddpclient.call('Device.register', [config], function (error, result) {
        if (error) return callback(error);

        assert(result.uuid, result);
        assert(result.token, result);

        this.uuid = result.uuid;
        this.token = result.token;

        this._afterConnect(callback, result);
      });
    });
  },


  /*
   * Runs imediately after a successful connection. Makes sure a UUID and token are set.
   */
  _afterConnect: function _afterConnect(callback, result) {

    this.ddpclient.subscribe('Device.messages', [{ uuid: this.uuid, token: this.token }], function (error) {
      if (error) return callback(error);

      if (!this._messageHandlerInstalled) {
        this._messageHandlerInstalled = true;

        this.ddpclient.on('message', function (data) {
          data = EJSON$1.parse(data);

          if (data.msg !== 'added' || data.collection !== 'Device.messages') {
            return;
          }

          this.push(data.fields.body);
        });
      }
    });

    // Now check to see if we have a stored UUID.
    // If no UUID is specified, store a new UUID.
    if (_$2.isUndefined(this.config.uuid) || _$2.isUndefined(this.config.token)) {
      this.config.uuid = result.uuid;
      this.config.token = result.token;

      this.writeChangesToGrowFile();
    }

    // SETUP STREAMS
    // Readable Stream: this is "readable" from the server perspective.
    // The device publishes it's data to the readable stream.
    this.readableStream = new Readable({ objectMode: true });

    // We are pushing data when sensor measures it so we do not do anything
    // when we get a request for more data. We just ignore it for now.
    this.readableStream._read = function () {};

    this.readableStream.on('error', function (error) {
      console.log("Error", error.message);
    });

    // Writable stream: this is writable from the server perspective. A device listens on
    // the writable stream to recieve new commands.
    this.writableStream = new Writable({ objectMode: true });

    callback(null, result);
  }
};

var _$1 = require('underscore');
var assert$1 = require('assert');
var util = require('util');
var Duplex = require('stream').Duplex;
var fs = require('fs');
var RSVP = require('rsvp');
var later = require('later');
var DDPClient = require('ddp');
var EJSON = require("ddp-ejson");
var Readable$1 = require('stream').Readable;
var Writable$1 = require('stream').Writable;

// Use local time.
later.date.localTime();

var Grow = function () {
  function Grow(config, callback) {
    babelHelpers.classCallCheck(this, Grow);

    this.thing = new Thing(config);

    // What does this do?
    Duplex.call(this, _$1.defaults(config, { objectMode: true, readableObjectMode: true, writableObjectMode: true }));

    this.uuid = this.thing.uuid || null;
    this.token = this.thing.token || null;

    this.ddpclient = new DDPClient(_$1.defaults(config, {
      host: 'localhost',
      port: 3000,
      ssl: false,
      maintainCollections: false
    }));

    this.ddpclient.connect(function (error, wasReconnect) {
      if (error) return callback(error);

      if (wasReconnect) {
        console.log("Reestablishment of a Grow server connection.");
      } else {
        console.log("Grow server connection established.");
      }

      if (this.uuid || this.token) {
        return this._afterConnect(callback, {
          uuid: this.uuid,
          token: this.token
        });
      }

      // console.log(JSON.stringify(this.config));
      // Break this out
      this.ddpclient.call('Device.register', [config], function (error, result) {
        if (error) return callback(error);

        assert$1(result.uuid, result);
        assert$1(result.token, result);

        this.uuid = result.uuid;
        this.token = result.token;

        this._afterConnect(callback, result);
      });
    });
  }

  // Remove?
  // this._messageHandlerInstalled = false;

  // TODO: test to make sure actions are registered even when there is no connection.
  // DDP.connect(function(error, data) {
  //   if (error) { console.log(error); }

  //   // // These should register reguardless of whether device connects.
  //   var actionsRegistered = new RSVP.Promise(function(resolve, reject) {
  //     try {
  //       resolve(this.registerActions());
  //     }
  //     catch (error) {
  //       reject(error);
  //     }
  //   });

  //   actionsRegistered.then(function(value) {
  //     self.pipeInstance();

  //     if (!_.isUndefined(callback)) {
  //       callback(null, self);
  //     }
  //   });
  // });

  /*
  * Runs imediately after a successful connection. Makes sure a UUID and token are set.
  */


  babelHelpers.createClass(Grow, [{
    key: '_afterConnect',
    value: function _afterConnect(callback, result) {
      console.log('called');

      this.ddpclient.subscribe('Device.messages', [{ uuid: this.uuid, token: this.token }], function (error) {
        if (error) return callback(error);

        if (!this._messageHandlerInstalled) {
          this._messageHandlerInstalled = true;

          this.ddpclient.on('message', function (data) {
            data = EJSON.parse(data);

            if (data.msg !== 'added' || data.collection !== 'Device.messages') {
              return;
            }

            this.push(data.fields.body);
          });
        }
      });

      // Now check to see if we have a stored UUID.
      // If no UUID is specified, store a new UUID.
      if (_$1.isUndefined(this.config.uuid) || _$1.isUndefined(this.config.token)) {
        this.config.uuid = result.uuid;
        this.config.token = result.token;

        this.writeChangesToGrowFile();
      }

      // SETUP STREAMS
      // Readable Stream: this is "readable" from the server perspective.
      // The device publishes it's data to the readable stream.
      this.readableStream = new Readable$1({ objectMode: true });

      // We are pushing data when sensor measures it so we do not do anything
      // when we get a request for more data. We just ignore it for now.
      this.readableStream._read = function () {};

      this.readableStream.on('error', function (error) {
        console.log("Error", error.message);
      });

      // Writable stream: this is writable from the server perspective. A device listens on
      // the writable stream to recieve new commands.
      this.writableStream = new Writable$1({ objectMode: true });

      callback(null, result);
    }

    // On _write, call API.sendData()

  }, {
    key: '_write',
    value: function _write(chunk, encoding, callback) {
      API.sendData(chunk, callback);
    }

    /*
     * We are pushing data to a stream as commands are arriving and are leaving
       to the stream to buffer them. So we simply ignore requests for more data.
     */

  }, {
    key: '_read',
    value: function _read(size) {}
  }, {
    key: 'registerActions',
    value: function registerActions() {
      var actions = this.thing.actions;

      // Sets up listening for actions on the writeable stream.
      this.writableStream._write = function (command, encoding, callback) {
        // console.log(command);
        for (var action in this.actions) {
          var actionId = this.actions[action].id;
          if (command.type === actionId) {
            if (command.options) {
              this.callAction(actionId, command.options);
            } else {
              this.callAction(actionId);
            }
          }
        }

        callback(null);
      };
    }
  }]);
  return Grow;
}();

;

describe('A feature test', function () {
  // beforeEach(() => {
  //   global.GrowInstance = new Grow(thing1);
  // });

  it('should have been run once', function () {
    // console.log(GrowInstance);
    var GrowInstance = new Grow(thing1);
    // expect(thing.constructor).to.have.been.calledOnce;
  });

  // it('should have always returned hello', () => {
  //   expect(Thing.constructor).to.have.always.returned('hello');
  // });

  afterEach(function () {
    delete global.GrowInstance;
  });
});
//# sourceMappingURL=test-bundle.js.map