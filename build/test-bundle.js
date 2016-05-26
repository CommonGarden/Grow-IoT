'use strict';

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

babelHelpers.inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

babelHelpers.possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

babelHelpers;

global.expect = require('chai').expect;

// require('babel/register');

(function setup() {
  beforeEach(function () {

    global.thing1 = {
      name: 'Light', // The display name for the thing.
      id: 'Light',
      username: 'YourUsernameHere', // The username of the account you want this device to be added to.
      properties: {
        state: 'off',
        lightconditions: function lightconditions() {
          return 'unset';
        }
      },
      actions: [// A list of action objects with ids
      {
        name: 'On', // Display name for the action
        description: 'Turns the light on.', // Optional description
        id: 'turn_light_on', // A unique id
        schedule: 'at 9:00am', // Optional scheduling using later.js
        event: 'Light turned on', // Optional event to emit when called.
        function: function _function() {
          // The implementation of the action.
          return 'Light on.';
        }
      }, {
        name: 'off',
        id: 'turn_light_off',
        schedule: 'at 8:30pm',
        event: 'Light turned off',
        function: function _function() {
          return 'Light off.';
        }
      }, {
        name: 'Log light data', // Events get a display name like actions
        id: 'light_data', // Events also get an id that is unique to the device
        type: 'light', // Currently need for visualization component... HACK.
        template: 'sensor',
        schedule: 'every 1 second', // Events should have a schedule option that determines how often to check for conditions.
        function: function _function() {
          // function should return the event to emit when it should be emited.
          return 10;
        }
      }],
      events: [{
        name: 'It\'s dark.',
        id: 'dark',
        on: 'light_data', // Hook into an action.
        function: function _function() {
          return;
        }
      }, {
        name: 'It\'s light.',
        id: 'light',
        on: 'light_data', // Hook into an action.
        function: function _function() {
          return;
        }
      }]
    };

    global.thing2 = {
      name: 'Light', // The display name for the thing.
      id: 'Light',
      username: 'YourUsernameHere', // The username of the account you want this device to be added to.
      properties: { // These can be updated by the API.
        state: 'off',
        lightconditions: function lightconditions() {
          return 'unset';
        }
      },
      actions: { // a list of action objects with keys
        turn_light_on: {
          name: 'On', // Display name for the action
          description: 'Turns the light on.', // Optional description
          schedule: 'at 9:00am', // Optional scheduling using later.js
          event: 'Light turned on', // Optional event to emit when called.
          function: function _function() {
            // The implementation of the action.
            return 'Light on.';
          }
        },
        turn_light_off: {
          name: 'off',
          schedule: 'at 8:30pm',
          event: 'Light turned off',
          function: function _function() {
            return 'Light off.';
          }
        },
        light_data: {
          name: 'Log light data', // Events get a display name like actions
          type: 'light', // Currently need for visualization component... HACK.
          template: 'sensor',
          schedule: 'every 1 second', // Events should have a schedule option that determines how often to check for conditions.
          function: function _function() {
            return 10;
          }
        }
      },
      events: {
        dark: {
          name: 'It\'s dark.',
          on: 'light_data', // Hook into an action.
          function: function _function() {
            return;
          }
        },
        light: {
          name: 'It\'s light.',
          on: 'light_data',
          function: function _function() {
            return;
          }
        }
      }
    };
  });

  afterEach(function () {
    delete global.thing1;
    delete global.thing2;
  });
})();

var _$1 = require('underscore');
var later = require('later');
var EventEmitter = require('events');

var Thing = function (_EventEmitter) {
  babelHelpers.inherits(Thing, _EventEmitter);

  /**
   * Constructs a new Thing object. A Thing is an extension of [node's built-in 
     EventEmitter class](https://nodejs.org/api/events.html).
   * @param {Object} config a javascript object containing metadata, properties, events, and actions
   * @return     A new thing object
  */

  function Thing(config) {
    babelHelpers.classCallCheck(this, Thing);

    var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(Thing).call(this));

    if (!config) {
      throw new Error('Thing.js requires an config object.');
    } else {
      _$1.extend(_this, config);
    }

    _this.registerActions();
    _this.registerEvents();
    _this.registerProperties();
    return _this;
  }

  /**
   * Starts any scheduled actions.
   * Todo: should also throw errors if actions don't have IDs or functions.
   */


  babelHelpers.createClass(Thing, [{
    key: 'registerActions',
    value: function registerActions() {
      var _this2 = this;

      this.scheduledActions = [];

      if (!_$1.isUndefined(this.actions)) {
        _$1.each(this.actions, function (action, key, list) {
          if (!_$1.isUndefined(action.schedule)) {
            _this2.startAction(key);
          }
        });
      }
    }

    /**
     * Starts listeners and scheduled events.
     * Todo: this needs better testing. IT IS ALSO NOT WORKING
       WITH MORE THAN ONE EVENT...
     */

  }, {
    key: 'registerEvents',
    value: function registerEvents() {
      var _this3 = this;

      this.scheduledEvents = [];

      if (!_$1.isUndefined(this.events)) {
        _$1.each(this.events, function (event, key, list) {
          if (!_$1.isUndefined(event.schedule)) {
            _this3.scheduleEvent(key);
          }

          if (!_$1.isUndefined(event.on)) {
            _this3.on(event.on, function () {
              event.function();
            });
          }
        });
      }
    }
  }, {
    key: 'registerProperties',
    value: function registerProperties() {
      if (!_$1.isUndefined(this.properties)) {
        for (var property in this.properties) {
          // If the property is a function we initialize it.
          if (typeof this.properties[property] === 'function') {
            // Note this function should return property value.
            this.properties[property] = this.properties[property]();
          }
        }
      }
    }

    /**
     * Get action object
     * @param {String} ID  The key / id of the action object you want.
     * @returns {Object}
     */

  }, {
    key: 'getAction',
    value: function getAction(ID) {
      var _this4 = this;

      var action = {};
      _$1.each(this.actions, function (value, key, list) {
        if (key === ID) {
          return action = value;
        } else if (_this4.actions[key].id === ID) {
          return action = value;
        }
      });

      return action;
    }

    /**
     * Get list of the Thing's actions
     * @returns {Object}
     */

  }, {
    key: 'getActions',
    value: function getActions() {
      return this.actions;
    }

    /**
     * Get event object
     * @param {String} ID  The key / id of the event object you want.
     * @returns {Object}
     */

  }, {
    key: 'getEvent',
    value: function getEvent(ID) {
      var _this5 = this;

      var event = {};
      _$1.each(this.events, function (value, key, list) {
        if (key === ID) {
          return event = value;
        } else if (_this5.events[key].id === ID) {
          return event = value;
        }
      });

      return event;
    }

    /**
     * Get list of the Thing's events
     * @returns {Object}
     */

  }, {
    key: 'getActions',
    value: function getActions() {
      return this.events;
    }

    /**
     * Update a property based on a component ID.
     * @param {String} property The property of the component to be update.
     * @param {String} value The value to update the property to.
     */

  }, {
    key: 'setProperty',
    value: function setProperty(property, value) {
      return this.properties[property] = value;
    }

    /* Get a property by key.
     * @param {String} property
     * @returns {String} property value.
     */

  }, {
    key: 'getProperty',
    value: function getProperty(property) {
      return this.properties[property];
    }

    /* Get a Thing's properties
     * @returns {Object}
     */

  }, {
    key: 'getProperties',
    value: function getProperties() {
      return this.properties;
    }

    /**
     * Calls a registered action, emits event if the the action has an 'event'
     * property defined. Updates the state if the action has an 'updateState'
     * property specified.
     * @param      {String}  actionId The id of the action to call.
     * @param      {Object}  options Optional, options to call with the function.
     */

  }, {
    key: 'callAction',
    value: function callAction(actionId, options) {
      try {
        var action = this.getAction(actionId);

        if (!_$1.isUndefined(options)) {
          var output = action.function(options);
        } else {
          var output = action.function();
        }
        this.emit(actionId);

        // We return any returns of called functions for testing.
        if (!_$1.isUndefined(output)) {
          return output;
        }
      } catch (error) {
        // If there is an error we emit an error.
        return this.emit('error', error);
      }
    }

    /**
     * Starts a reoccurring action if a schedule property is defined.
     * @param {Object} action An action object.
     */

  }, {
    key: 'startAction',
    value: function startAction(actionKey) {
      var _this6 = this;

      var action = this.getAction(actionKey);
      var schedule = later.parse.text(action.schedule);
      var scheduledAction = later.setInterval(function () {
        _this6.callAction(actionKey);
      }, schedule);
      this.scheduledActions.push(scheduledAction);
      return scheduledAction;
    }

    /**
     * Starts a reoccurring event if a schedule property is defined.
     * @param {Object} event An event object.
     */

  }, {
    key: 'scheduleEvent',
    value: function scheduleEvent(eventKey) {
      var _this7 = this;

      var event = this.getEvent(eventKey);
      var schedule = later.parse.text(event.schedule);
      var scheduledEvent = later.setInterval(function () {
        _this7.callEvent(eventKey);
      }, schedule);
      this.scheduledEvents.push(scheduledEvent);
      return scheduledEvent;
    }
  }]);
  return Thing;
}(EventEmitter);

;

var _ = require('underscore');

describe('Thing test', function () {
  beforeEach(function () {
    // global.testThing = new Thing(thing1);
    global.testThing2 = new Thing(thing2);
  });

  it('should have cloned metadata', function () {
    // expect(testThing.name).to.equal('Light');
    // expect(testThing.id).to.equal('Light');
    // expect(testThing.username).to.equal('YourUsernameHere');
    expect(testThing2.name).to.equal('Light');
    expect(testThing2.id).to.equal('Light');
    expect(testThing2.username).to.equal('YourUsernameHere');
  });

  describe('ACTIONS', function () {
    it('should register actions in the config object', function () {
      // expect(_.allKeys(testThing.actions).length).to.equal(3);
      expect(_.allKeys(testThing2.actions).length).to.equal(3);
    });

    it('should return the right action object when given an action id.', function () {
      // var action = testThing.getAction('light_data');
      var action2 = testThing2.getAction('light_data');
      // console.log(action2);
      // expect(action.name).to.equal('Log light data');
      expect(action2.name).to.equal('Log light data');
    });

    it('should be able to call a registered action.', function () {
      expect(testThing2.callAction('turn_light_on')).to.equal('Light on.');
    });

    it('should emit an event when an action is called', function () {
      var event = false;
      testThing2.on('turn_light_on', function () {
        return event = true;
      });
      testThing2.callAction('turn_light_on');
      expect(event).to.equal(true);
    });
  });

  describe('EVENTS', function () {
    it('should register events in the config object', function () {
      expect(_.allKeys(testThing2.events).length).to.equal(2);
    });

    it('should return the right event object when given an id.', function () {
      // var component = testThing.getEvent('dark');
      var component2 = testThing2.getEvent('dark');
      // expect(component.name).to.equal('It\'s dark.');
      expect(component2.name).to.equal('It\'s dark.');
    });
  });

  describe('PROPERTIES', function () {
    // Maybe killing this...
    // it('should update a component property correctly', () => {
    //   testThing.updateComponentProperty('turn_light_on', 'schedule', 'at 9:30am')
    //   expect(testThing.getAction('turn_light_on').schedule).to.equal('at 9:30am');
    // });

    // Note: testThing 2 has experimental support for properties
    it('should initialize correctly', function () {
      expect(testThing2.getProperty('lightconditions')).to.equal('unset');
    });

    // Note: testThing 2 has experimental support for properties
    it('should set a property', function () {
      testThing2.setProperty('lightconditions', 'dark');
      expect(testThing2.getProperty('lightconditions')).to.equal('dark');
    });
  });

  afterEach(function () {
    delete global.testThing2;
  });
});
//# sourceMappingURL=test-bundle.js.map