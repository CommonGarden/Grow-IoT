(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Thing = factory());
}(this, function () { 'use strict';

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

  /**
   * # Actions
   * 
   * Example:
   * ```
   *  "actions": [ // A list of action objects
   *     {
   *         "name": "On", // Display name for the action
   *         "description": "Turns the light on.", // Optional description
   *         "id": "turn_light_on", // A unique id
   *         "updateState": "on", // Updates state on function call
   *         "schedule": "at 9:00am", // Optional scheduling using later.js
   *         "event": "Light turned on", // Optional event to emit when called.
   *         "function": function () {
   *             // The implementation of the action.
   *             LED.high();
   *             console.log("Light on.");
   *         }
   *     }
   *   ]
   * ```
   */

  var _$1 = require('underscore');
  var later = require('later');

  var Actions = {
    /**
     * Registers actions and returns a new actions object
     * @param {Object} thing  
     * @return     A new grow instance.
    */

    register: function register(thing) {
      this.actions = [];
      this.scheduledActions = [];

      // this.emit = thing.emit;

      for (var key in thing) {
        // Check top level thing model for actions.
        if (key === 'actions') {
          for (var action in thing[key]) {
            this.actions.push(thing[key][action]);
          }
        }
      }

      for (var action in this.actions) {
        var actionId = this.actions[action].id;
        var action = this.getActionByID(actionId);
        if (!_$1.isUndefined(action)) {
          this.startAction(actionId);
        }
      }

      return this;
    },


    /**
     * Get action object based on the action id
     * @param {String} actionId  The id of the action object you want.
     * @returns {Object}
     */
    getActionByID: function getActionByID(actionId) {
      for (var i = this.actions.length - 1; i >= 0; i--) {
        if (this.actions[i].id === actionId) {
          return this.actions[i];
        }
      }
    },


    /**
     * Calls a registered action, emits event if the the action has an 'event'
     * property defined. Updates the state if the action has an 'updateState'
     * property specified.
     * @param      {String}  actionId The id of the action to call.
     * @param      {Object}  options Optional, options to call with the function.
    */
    callAction: function callAction(actionId, options) {
      var action = this.getActionByID(actionId);

      this.emit(actionId);

      if (!_$1.isUndefined(options)) {
        return action.function(options);
      } else {
        return action.function();
      }
    },


    /**
     * Starts a reoccurring action if a schedule property is defined.
     * @param {Object} action An action object.
     */
    startAction: function startAction(action) {
      var _this = this;

      var meta = this.getActionByID(action);
      if (!_$1.isUndefined(meta.schedule)) {
        var schedule = later.parse.text(meta.schedule);
        var scheduledAction = later.setInterval(function () {
          _this.callAction(action);
        }, schedule);
        this.scheduledActions.push(scheduledAction);
        return scheduledAction;
      }
    }
  };

  /**
   * # Events
   * Events are functions that return a value to emit as event or doesn't return 
     (in which case no event is emitted). 

   * NOTE: Events currently run like jobs and so REQUIRE a schedule property. 
     This is not nice, let's rewrite.
   
   * The "events" property of the thing object takes a list of event objects. For example:

          "events": [
              {
                  "name": "Light data",
                  "id": "light_data",
                  "schedule": "every 1 second",
                  "function": function () {
                      // function should return the event to emit when it should be emited.
                      return lightSensor.value;
                  }
              }
          ]
   */

  var _$2 = require('underscore');
  var later$1 = require('later');

  var Events = function () {
    /**
     * Register a new events object.
     * @param {Object} thing  
     * @return     A new events object
    */

    function Events(thing) {
      babelHelpers.classCallCheck(this, Events);

      this.events = [];
      this.scheduledEvents = [];

      this.emit = thing.emit;

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
        if (!_$2.isUndefined(event)) {
          this.startEvent(eventId);
        }
      }
    }

    /**
     * Get event object based on the event id
     * @param {String} eventId  The id of the event object you want.
     * @returns {Object}
     */


    babelHelpers.createClass(Events, [{
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

        if (!_$2.isUndefined(options)) {
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
        var _this = this;

        var meta = this.getEventByID(event);
        if (!_$2.isUndefined(meta.schedule)) {
          var schedule = later$1.parse.text(meta.schedule);
          var scheduledEvent = later$1.setInterval(function () {
            _this.callEvent(event);
          }, schedule);
          this.scheduledEvents.push(scheduledEvent);
          return scheduledEvent;
        }
      }
    }]);
    return Events;
  }();

  ;

  var _ = require('underscore');
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

      // Register actions events
      Actions.register(_this);
      _this.events = new Events(_this);
      return _this;
    }

    return Thing;
  }(EventEmitter);

  ;

  return Thing;

}));
//# sourceMappingURL=Thing.umd.js.map