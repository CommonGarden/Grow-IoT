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

  /**
   * Class representing a Thing. A Thing is an extension of [node's built-in EventEmitter class](https://nodejs.org/api/events.html).
   * @extends EventEmitter
   */

  var Thing = function (_EventEmitter) {
    babelHelpers.inherits(Thing, _EventEmitter);

    /**
     * Constructs a new Thing object.
     * @constructor
     * @param {Object} config  an object containing properties, events, and/or actions.
     * @param {Function} callback  an optional callback
     * @return     A new thing object
    */

    function Thing(config, callback) {
      babelHelpers.classCallCheck(this, Thing);

      var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(Thing).call(this));

      if (!config) {
        throw new Error('Thing.js requires an config object.');
      } else {
        _.extend(_this, config);
      }

      _this.registerActions();
      _this.registerEvents();
      _this.registerProperties();

      // Callback is optional. May be used for a start function.
      if (!_.isUndefined(callback)) {
        callback();
      }
      return _this;
    }

    /**
     * Run when the Thing is initialized. Starts any scheduled actions.
     */


    babelHelpers.createClass(Thing, [{
      key: 'registerActions',
      value: function registerActions() {
        var _this2 = this;

        this.scheduledActions = [];

        if (!_.isUndefined(this.actions)) {
          _.each(this.actions, function (action, key, list) {
            if (!_.isUndefined(action.schedule)) {
              _this2.startAction(key);
            }
          });
        }
      }

      /**
       * Run when the Thing is initialized. Starts listeners and schedules events.
       */

    }, {
      key: 'registerEvents',
      value: function registerEvents() {
        var _this3 = this;

        this.scheduledEvents = [];

        if (!_.isUndefined(this.events)) {
          _.each(this.events, function (event, key, list) {
            if (!_.isUndefined(event.schedule)) {
              _this3.scheduleEvent(key);
            }

            if (!_.isUndefined(event.on)) {
              _this3.on(event.on, function () {
                event.function();
              });
            }
          });
        }
      }

      /**
       * Initializes properties.
       */

    }, {
      key: 'registerProperties',
      value: function registerProperties() {
        if (!_.isUndefined(this.properties)) {
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
       * @param {String} ID  The key of the action object you want.
       * @returns {Object}
       */

    }, {
      key: 'getAction',
      value: function getAction(ID) {
        var _this4 = this;

        var action = {};
        _.each(this.actions, function (value, key, list) {
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
        _.each(this.events, function (value, key, list) {
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
      key: 'getEvents',
      value: function getEvents() {
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
        this.properties[property] = value;
        this.emit('property-updated');
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

  return Thing;

}));
//# sourceMappingURL=Thing.umd.js.map