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
var Readable = require('stream').Readable;
var Writable = require('stream').Writable;

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
var DDPClient = require('ddp');
var EJSON = require("ddp-ejson");

var DDP = {
  connect: function connect(config, callback) {
    this.ddpclient = new DDPClient(_$2.defaults(config, {
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

      this.ddpclient.call('Device.register', [this.config], function (error, result) {
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
    if (_$2.isUndefined(this.config.uuid) || _$2.isUndefined(this.config.token)) {
      this.config.uuid = result.uuid;
      this.config.token = result.token;

      this.writeChangesToGrowFile();
    }

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

// Use local time.
later.date.localTime();

var Grow = function () {
  // callAction: Actions.callAction,

  function Grow(config) {
    babelHelpers.classCallCheck(this, Grow);


    this.thing = new Thing(config);

    // What does this do?
    Duplex.call(this, _$1.defaults(this.thing, { objectMode: true, readableObjectMode: true, writableObjectMode: true }));

    this.uuid = this.thing.uuid || null;
    this.token = this.thing.token || null;

    // Remove?
    this._messageHandlerInstalled = false;

    // TODO: test to make sure actions are registered even when there is no connection.
    DDP.connect(function (error, data) {
      if (error) {
        console.log(error);

        // TODO: register actions and make attempt to make reconnection.
        // The idea is that if connection is lost the program shouldn't stop,
        // but should also try to reconnect.
      }

      // // These should register reguardless of whether device connects.
      // var actionsRegistered = new RSVP.Promise(function(resolve, reject) {
      //   try {
      //     resolve(self.registerActions(config));
      //   }
      //   catch (error) {
      //     reject(error);
      //   }
      // });

      // // These should register reguardless of whether device connects.
      // var eventsRegistered = new RSVP.Promise(function(resolve, reject) {
      //   try {
      //     resolve(self.registerEvents(config));
      //   }
      //   catch (error) {
      //     reject(error);
      //   }
      // });

      // actionsRegistered.then(function(value) {
      //   self.pipeInstance();

      //   if (!_.isUndefined(callback)) {
      //     callback(null, self);
      //   }
      // });
    });
  }

  // On _write, call API.sendData()


  babelHelpers.createClass(Grow, [{
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
  }]);
  return Grow;
}();

;

describe('A feature test', function () {
  beforeEach(function () {
    global.testThing = new Grow(thing1);
  });

  it('should have been run once', function () {
    // Ok we have Thing.js, now let's use it.
    console.log(testThing);
    // expect(thing.constructor).to.have.been.calledOnce;
  });

  // it('should have always returned hello', () => {
  //   expect(Thing.constructor).to.have.always.returned('hello');
  // });

  afterEach(function () {
    delete global.testThing;
  });
});
//# sourceMappingURL=test-bundle.js.map