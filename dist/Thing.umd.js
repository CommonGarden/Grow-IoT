(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.rollupStarterProject = factory());
}(this, function () { 'use strict';

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
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

  var inherits = function (subClass, superClass) {
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

  var possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

  var _ = require('underscore');
  var later = require('meteor-later');
  var EventEmitter = require('events');

  /**
   * A Thing is an extension of [node's built-in EventEmitter class](https://nodejs.org/api/events.html).
   * @extends EventEmitter
   * @param {Object} config  an object containing properties, events, and/or actions.
   * @param {Function} callback  an optional callback
   * @return     A new thing object
   */

  var Thing = function (_EventEmitter) {
    inherits(Thing, _EventEmitter);

    function Thing(config, callback) {
      classCallCheck(this, Thing);

      var _this = possibleConstructorReturn(this, Object.getPrototypeOf(Thing).call(this));

      if (!config) {
        throw new Error('Thing.js requires an config object.');
      } else {
        _.extend(_this, config);
      }

      _this.scheduled = {};

      if (!_.isUndefined(_this.actions)) {
        _.each(_this.actions, function (action, key, list) {
          if (!_.isUndefined(action.schedule)) {
            _this.schedule(key);
          }
        });
      }

      if (!_.isUndefined(_this.events)) {
        _.each(_this.events, function (event, key, list) {
          if (!_.isUndefined(event.schedule)) {
            _this.schedule(key);
          }

          if (!_.isUndefined(event.on)) {
            _this.on(event.on, function () {
              if (!_.isUndefined(event.rule)) {
                if (event.rule.condition() === true) {
                  event.rule.consequence();
                }
              } else {
                event.function();
              }
            });
          }
        });
      }

      if (!_.isUndefined(_this.properties)) {
        for (var property in _this.properties) {
          // If the property is a function we initialize it.
          if (typeof _this.properties[property] === 'function') {
            // Note this function should return property value.
            _this.properties[property] = _this.properties[property]();
          }
        }
      }

      // Callback is optional. May be used for a start function.
      if (!_.isUndefined(callback)) {
        callback();
      }
      return _this;
    }

    /**
     * Get action object
     * @param {String} ID  The key of the action object you want.
     * @returns {Object}
     */


    createClass(Thing, [{
      key: 'getAction',
      value: function getAction(ID) {
        var _this2 = this;

        var action = {};
        _.each(this.actions, function (value, key, list) {
          if (key === ID) {
            return action = value;
          } else if (_this2.actions[key].id === ID) {
            return action = value;
          }
        });

        if (_.isEmpty(action)) {
          return false;
        } else {
          return action;
        }
      }

      /**
       * Get event object
       * @param {String} ID  The key / id of the event object you want.
       * @returns {Object}
       */

    }, {
      key: 'getEvent',
      value: function getEvent(ID) {
        var _this3 = this;

        var event = {};
        _.each(this.events, function (value, key, list) {
          if (key === ID) {
            return event = value;
          } else if (_this3.events[key].id === ID) {
            return event = value;
          }
        });

        if (_.isEmpty(event)) {
          return false;
        } else {
          return event;
        }
      }

      /**
       * Update a property based on a component ID.
       * @param {String} property The property of the component to be update.
       * @param {String} value The value to update the property to.
       */
      // Modify to make more generally useful...

    }, {
      key: 'set',
      value: function set(property, value, key) {
        if (_.isUndefined(key)) {
          this.properties[property] = value;
          this.emit('property-updated');
        } else {
          // what if they both have the same key?
          var action = this.getAction(key);
          var event = this.getEvent(key);
          if (action) {
            action[property] = value;
          } else if (event) {
            event[property] = value;
          }
          this.emit('property-updated');
        }
      }

      /* Get a property by key.
       * @param {String} property
       * @returns {String} property value.
       */

    }, {
      key: 'get',
      value: function get(property, key) {
        if (_.isUndefined(key)) {
          return this.properties[property];
        } else {
          var action = this.getAction(key);
          var event = this.getEvent(key);
          if (action) {
            return action[property];
          }
          if (event) {
            return event[property];
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
      key: 'call',
      value: function call(actionId, options) {
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
       * Starts a reoccurring action or event if a schedule property is defined.
       * @param {Object} action An action object.
       */

    }, {
      key: 'schedule',
      value: function schedule(key) {
        var _this4 = this;

        // what if they both have the same key?
        var action = this.getAction(key);
        var event = this.getEvent(key);
        if (action) {
          var schedule = later.parse.text(action.schedule);
          var scheduledAction = later.setInterval(function () {
            _this4.call(key);
          }, schedule);
          return this.scheduled[key] = scheduledAction;
        } else if (event) {
          var _schedule = later.parse.text(event.schedule);
          var scheduledEvent = later.setInterval(function () {
            _this4.call(key);
          }, _schedule);
          return this.scheduled[key] = scheduledEvent;
        }
      }
    }]);
    return Thing;
  }(EventEmitter);

  ;

  return Thing;

}));
//# sourceMappingURL=Thing.umd.js.map