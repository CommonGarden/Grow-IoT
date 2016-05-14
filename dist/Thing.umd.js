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
          var actionId = this.actions[action].id;
          var action = this.getActionByID(actionId);
          if (!_.isUndefined(action)) {
            this.startAction(actionId);
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

        // TODO: don't do this with a for loop. Just check this.events.
        for (var key in this) {
          if (key === 'events') {
            for (var event in this[key]) {
              event = this[key][event];
              this.on(event.on, function () {
                event.function();
              });
            }
          }
        }

        for (var event in this.events) {
          var eventId = this.events[event].id;
          // this is silly, because it's called both here and in startEvent...
          var event = this.getEventByID(eventId);
          if (!_.isUndefined(event)) {
            this.startEvent(eventId);
          }
        }
      }

      /**
       * Get action object based on the action id
       * @param {String} actionId  The id of the action object you want.
       * @returns {Object}
       */

    }, {
      key: 'getActionByID',
      value: function getActionByID(actionId) {
        // Todo, check to make sure actions ex

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

        // do we need to make the redundent call to getActionByID?
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

      // This was a hack... delete?
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

  return Thing;

}));
//# sourceMappingURL=Thing.umd.js.map