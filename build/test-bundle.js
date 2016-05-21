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

    // Setup test things
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
      }, {
        'name': 'Light data',
        'id': 'light_data',
        'type': 'light',
        'schedule': 'every 1 second',
        'function': function _function() {
          // Normally, this would be publishing data on the readable stream.
          return 'data';
        }
      }],
      'events': [{
        'name': 'light data is data',
        'id': 'check_light_data',
        'on': 'light_data', // Hook into an action.
        'function': function _function() {
          return 'this';
        }
      }, {
        name: 'Change light bulb event',
        id: 'change_light_bulb',
        schedule: 'after 10 seconds' // Emits this event in 30s
      }]
    };

    global.thing2 = {
      name: "Light", // The display name for the thing.
      id: "Light",
      desription: "An LED light with a basic on/off api.",
      username: "jakehart", // The username of the account you want this device to be added to.
      properties: {
        state: "off",
        lightconditions: null
      },
      actions: [// A list of action objects
      {
        name: "On", // Display name for the action
        description: "Turns the light on.", // Optional description
        id: "turn_light_on", // A unique id
        schedule: "at 9:00am", // Optional scheduling using later.js
        event: "Light turned on", // Optional event to emit when called.
        function: function _function() {
          // The implementation of the action.
          LED.high();
          grow.updateProperty('state', 'on');
        }
      }, {
        name: "off",
        id: "turn_light_off",
        schedule: "at 8:30pm",
        event: "Light turned off",
        function: function _function() {
          LED.low();
          grow.updateProperty('state', 'off');
        }
      }, {
        name: "Log light data", // Events get a display name like actions
        id: "light_data", // Events also get an id that is unique to the device
        type: "light", // Currently need for visualization component... HACK.
        template: "sensor",
        schedule: "every 1 second", // Events should have a schedule option that determines how often to check for conditions.
        function: function _function() {
          // function should return the event to emit when it should be emited.
          grow.sendData({
            type: "light",
            value: lightSensor.value
          });
        }
      }],
      events: [{
        name: "It's dark.",
        id: 'dark',
        on: 'light_data', // Hook into an action.
        function: function _function() {
          if (lightSensor.value < 100 && grow.getProperty('lightconditions') != 'dark') {
            grow.emitEvent('dark');
            grow.setProperty('lightconditions', 'dark');
          }
        }
      }]
    };
  });

  afterEach(function () {
    delete global.thing1;
    delete global.thing2;
  });
})();

var _ = require('underscore');
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
      _.extend(_this, config);
    }

    _this.registerActions();
    _this.registerEvents();
    return _this;
  }

  /**
   * Starts any scheduled actions.
   * Todo: should also throw errors if actions don't have IDs or functions.
   */


  babelHelpers.createClass(Thing, [{
    key: 'registerActions',
    value: function registerActions() {
      this.scheduledActions = [];

      for (var action in this.actions) {
        // TODO:
        // Through error if no id is assigned?
        // or perhaps generate id?
        var actionId = this.actions[action].id;

        if (!_.isUndefined(action)) {
          this.startAction(this.actions[action]);
        }
      }
    }

    /**
     * Starts listeners and scheduled events.
     * Todo: this needs better testing.
     */

  }, {
    key: 'registerEvents',
    value: function registerEvents() {
      this.scheduledEvents = [];

      // Check top level thing model for events.
      if (!_.isUndefined(this.events)) {
        for (var event in this.events) {
          event = this.events[event];

          if (!_.isUndefined(event.schedule)) {
            this.scheduleEvent(event);
          }

          if (!_.isUndefined(event.on)) {
            this.on(event.on, function () {
              event.function();
            });
          }
        }
      }
    }

    /**
     * Get component object (an action or event for example) based on the id
     * @param {String} ID  The id of the component object you want.
     * @returns {Object}
     */

  }, {
    key: 'getComponentByID',
    value: function getComponentByID(ID) {
      // Check top level component
      if (this.id === ID) {
        return this;
      }

      // Check action and event components
      else {
          return _.findWhere(this.actions, { id: ID }) || _.findWhere(this.events, { id: ID });
        }
    }

    /**
     * Update a property based on a component ID.
     * @param {String} componentID The id of the component to change the property of.
     * @param {String} property The property of the component to be update.
     * @param {String} value The value to update the property to.
     */

  }, {
    key: 'updateComponentProperty',
    value: function updateComponentProperty(componentID, property, value) {
      var component = this.getComponentByID(componentID);
      return component[property] = value;
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

    /* Get a property by name.
     * @param {String} property
     * @returns {String} property value.
     */

  }, {
    key: 'getProperty',
    value: function getProperty(property) {
      console.log(this.properties);
      return this.properties[property];
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
        var action = this.getComponentByID(actionId);

        if (!_.isUndefined(options)) {
          var output = action.function(options);
        } else {
          var output = action.function();
        }
        this.emit(actionId);

        // We return any returns of called functions for testing.
        if (!_.isUndefined(output)) {
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
    value: function startAction(action) {
      var _this2 = this;

      var schedule = later.parse.text(action.schedule);
      var scheduledAction = later.setInterval(function () {
        _this2.callAction(action.id);
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
    value: function scheduleEvent(event) {
      var _this3 = this;

      var schedule = later.parse.text(event.schedule);
      var scheduledEvent = later.setInterval(function () {
        _this3.callEvent(event.id);
      }, schedule);
      this.scheduledEvents.push(scheduledEvent);
      return scheduledEvent;
    }
  }]);
  return Thing;
}(EventEmitter);

;

/*
  TODO:
  * update property
*/

describe('Thing test', function () {
  beforeEach(function () {
    global.testThing = new Thing(thing1);
    global.testThing2 = new Thing(thing2);
  });

  it('should have cloned metadata', function () {
    expect(testThing.name).to.equal('Light');
    expect(testThing.description).to.equal('An LED light with a basic on/off api.');
  });

  describe('ACTIONS', function () {
    it('should register actions in the config object', function () {
      expect(testThing.actions.length).to.equal(3);
    });

    it('should return the right action object when given an action id.', function () {
      var action = testThing.getComponentByID('light_data');
      expect(action.name).to.equal('Light data');
    });

    it('should be able to call a registered action.', function () {
      expect(testThing.callAction('turn_light_on')).to.equal('Light on.');
    });

    it('should emit an event when an action is called', function () {
      var event = false;
      testThing.on('turn_light_on', function () {
        return event = true;
      });
      testThing.callAction('turn_light_on');
      expect(event).to.equal(true);
    });
  });

  describe('EVENTS', function () {
    it('should register events in the config object', function () {
      expect(testThing.events.length).to.equal(2);
    });

    it('should return the right event object when given an id.', function () {
      var component = testThing.getComponentByID('check_light_data');
      expect(component.name).to.equal('light data is data');
    });
  });

  describe('PROPERTIES', function () {
    it('should update a component property correctly', function () {
      testThing.updateComponentProperty('turn_light_on', 'schedule', 'at 9:30am');
      expect(testThing.getComponentByID('turn_light_on').schedule).to.equal('at 9:30am');
    });

    // Note: testThing 2 is experimental
    it('should return the currect property', function () {
      // console.log(thing2);
      expect(testThing2.getProperty('lightconditions')).to.equal(null);
    });

    it('should set a property', function () {
      // console.log(thing2);
      testThing2.setProperty('lightconditions', 'dark');
      expect(testThing2.getProperty('lightconditions')).to.equal('dark');
    });
  });

  afterEach(function () {
    delete global.testThing;
  });
});
//# sourceMappingURL=test-bundle.js.map