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

require('babel/register');

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
      }]
    };
  });

  afterEach(function () {
    delete global.thing1;
  });
})();

var _ = require('underscore');
var later = require('later');
var EventEmitter = require('events');

var Thing = function (_EventEmitter) {
  babelHelpers.inherits(Thing, _EventEmitter);

  /**
   * Constructs a new thing object.
   * @param {Object} config
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

    // Register actions events
    _this.registerActions();
    _this.registerEvents();
    return _this;
  }

  /**
   * Registers actions and starts any scheduled actions.
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
     * Register a events and setup listeners.
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

          this.on(event.on, function () {
            event.function();
          });
        }
      }
    }

    /**
     * Get component object based on the id
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
     * @param {function} callback an optional callback function
     */

  }, {
    key: 'updateProperty',
    value: function updateProperty(componentID, property, value) {
      var component = this.getComponentByID(componentID);
      return component[property] = value;
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

      // do we need to make the redundent call to getActionByID?
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
  });

  it('should have been constructed correctly', function () {
    // console.log(testThing);
    expect(testThing.name).to.equal('Light');
    expect(testThing.description).to.equal('An LED light with a basic on/off api.');
  });

  it('should register actions in the config object', function () {
    expect(testThing.actions.length).to.equal(3);
  });

  it('should register events in the config object', function () {
    expect(testThing.events.length).to.equal(1);
  });

  it('should return the right action object when given an action id.', function () {
    var action = testThing.getComponentByID('light_data');
    expect(action.name).to.equal('Light data');
  });

  it('should return the right event object when given an id.', function () {
    var component = testThing.getComponentByID('check_light_data');
    expect(component.name).to.equal('light data is data');
  });

  it('should be able to call a registered action.', function () {
    expect(testThing.callAction('turn_light_on')).to.equal('Light on.');
  });

  it('should update a component property correctly', function () {
    testThing.updateProperty('turn_light_on', 'schedule', 'at 9:30am');
    expect(testThing.getComponentByID('turn_light_on').schedule).to.equal('at 9:30am');
  });

  it('should emit an event when an action is called', function () {
    var event = false;
    testThing.on('turn_light_on', function () {
      return event = true;
    });
    testThing.callAction('turn_light_on');
    expect(event).to.equal(true);
  });

  afterEach(function () {
    delete global.testThing;
  });
});
//# sourceMappingURL=test-bundle.js.map