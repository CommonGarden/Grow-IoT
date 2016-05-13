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

// /* Basic tests for actions module.*/

// import Thing from '../../lib/index';

// /*
//   TODO:
//   * Test calling an action with options.
// */

// describe('Test actions', () => {
//   beforeEach(() => {
//     global.thing = new Thing(thing1);
//   });

//   it('should register actions in the config object', () => {
//     expect(thing.actions.length).to.equal(2);
//   });

//   it('should call the right action when given an actionId', () => {
//     expect(thing.callAction('turn_light_on')).to.equal('Light on.');
//   });

//   it('should return the right action object when given an action id.', () => {
//     var action = thing.actions.getActionByID('turn_light_on');
//     expect(action.name).to.equal('On');
//     expect(action.description).to.equal('Turns the light on.');
//   });

//   it('should emit an event when called', () => {
//     var event = false;
//     thing.actions.on('turn_light_on', () => {
//       return event = true;
//     });
//     thing.actions.callAction('turn_light_on');
//     expect(event).to.equal(true);
//   });

//   afterEach(() => {
//     delete global.thing;
//   });
// });

/* Basic tests for events module.*/

// import Thing from '../../lib/index';

/*
  TODO:
  * Test scheduled events
*/

/*
describe('Test events', () => {
  beforeEach(() => {
    global.thing = new Thing(thing1);
  });

  it('should register events in the config object', () => {
    console.log(thing);
    expect(thing.events.length).to.equal(1);
  });

  it('should call the right event when given an eventId', () => {
    expect(thing.events.callEvent('light_data')).to.equal('data');
  });

  it('should return the right event object when given an event id.', () => {
    var event = thing.events.getEventByID('light_data');
    expect(event.name).to.equal('Light data');
  });

  afterEach(() => {
    delete global.thing;
  });
});

*/

var _ = require('underscore');
var later = require('later');
var EventEmitter = require('events');

var Thing = function (_EventEmitter) {
  babelHelpers.inherits(Thing, _EventEmitter);

  /**
   * Constructs a new thing object.
   * @param {Object} config
   * @return     A new events object
  */

  function Thing(config) {
    babelHelpers.classCallCheck(this, Thing);

    var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(Thing).call(this));

    if (!config) {
      throw new Error('Thing.js requires an config object.');
    } else {
      _.extend(_this, config);
    }

    console.log(_this);

    // Register actions events
    _this.registerActions();
    _this.registerEvents();
    return _this;
  }

  /**
   * Registers actions and returns a new actions object
   * @param {Object} thing  
   * @return     A new grow instance.
  */


  babelHelpers.createClass(Thing, [{
    key: 'registerActions',
    value: function registerActions() {
      // this.actions = [];
      this.scheduledActions = [];

      // this.emit = thing.emit;

      // for (var key in thing) {
      //   // Check top level thing model for actions.
      //   if (key === 'actions') {
      //     for (var action in thing[key]) {
      //       this.actions.push(thing[key][action]);
      //     }
      //   }
      // }

      for (var action in this.actions) {
        var actionId = this.actions[action].id;
        var action = this.getActionByID(actionId);
        if (!_.isUndefined(action)) {
          this.startAction(actionId);
        }
      }

      return this;
    }

    /**
     * Get action object based on the action id
     * @param {String} actionId  The id of the action object you want.
     * @returns {Object}
     */

  }, {
    key: 'getActionByID',
    value: function getActionByID(actionId) {
      for (var i = this.actions.length - 1; i >= 0; i--) {
        if (this.actions[i].id === actionId) {
          return this.actions[i];
        }
      }
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
      var action = this.getActionByID(actionId);

      this.emit(actionId);

      if (!_.isUndefined(options)) {
        return action.function(options);
      } else {
        return action.function();
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

      var meta = this.getActionByID(action);
      if (!_.isUndefined(meta.schedule)) {
        var schedule = later.parse.text(meta.schedule);
        var scheduledAction = later.setInterval(function () {
          _this2.callAction(action);
        }, schedule);
        this.scheduledActions.push(scheduledAction);
        return scheduledAction;
      }
    }

    /**
    * Register a new events object.
    * @param {Object} thing  
    * @return     A new events object
    */

  }, {
    key: 'registerEvents',
    value: function registerEvents(thing) {
      this.events = [];
      this.scheduledEvents = [];

      // this.emit = thing.emit;

      for (var key in thing) {
        // Check top level thing model for events.
        if (key === 'events') {
          for (var event in thing[key]) {
            this.events.push(thing[key][event]);
          }
        }
      }

      for (var event in this.events) {
        var eventId = this.events[event].id;
        var event = this.getEventByID(eventId);
        if (!_.isUndefined(event)) {
          this.startEvent(eventId);
        }
      }
    }

    /**
     * Get event object based on the event id
     * @param {String} eventId  The id of the event object you want.
     * @returns {Object}
     */

  }, {
    key: 'getEventByID',
    value: function getEventByID(eventId) {
      for (var i = this.events.length - 1; i >= 0; i--) {
        if (this.events[i].id === eventId) {
          return this.events[i];
        }
      }
    }

    /**
     * Calls a registered event function.
     * @param      {String}  eventId The id of the event to call.
     * @param      {Object}  options Optional, options to call with the function.
    */

  }, {
    key: 'callEvent',
    value: function callEvent(eventId, options) {
      var event = this.getEventByID(eventId);

      this.emit(eventId);

      if (!_.isUndefined(options)) {
        return event.function(options);
      } else {
        return event.function();
      }
    }

    /**
     * Starts a reoccurring event if a schedule property is defined.
     * @param {Object} event An event object.
     */

  }, {
    key: 'startEvent',
    value: function startEvent(event) {
      var _this3 = this;

      var meta = this.getEventByID(event);
      if (!_.isUndefined(meta.schedule)) {
        var schedule = later.parse.text(meta.schedule);
        var scheduledEvent = later.setInterval(function () {
          _this3.callEvent(event);
        }, schedule);
        this.scheduledEvents.push(scheduledEvent);
        return scheduledEvent;
      }
    }
  }]);
  return Thing;
}(EventEmitter);

;

/*
  TODO:
  * callback?
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

  it('should be able to call a registered action.', function () {
    expect(testThing.callAction('turn_light_on')).to.equal('Light on.');
  });

  it('should emit an event when called', function () {
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