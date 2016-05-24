import EventEmitter from 'events';

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

      if (!_.isUndefined(this.actions)) {
        _.each(this.actions, function (action, key, list) {
          if (!_.isUndefined(action.schedule)) {
            _this2.startAction(_this2.actions[key]);
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

      if (!_.isUndefined(this.events)) {
        _.each(this.events, function (event, key, list) {

          if (!_.isUndefined(event.schedule)) {
            _this3.scheduleEvent(event);
          }

          if (!_.isUndefined(event.on)) {
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
     * @param {String} ID  The key / id of the action object you want.
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
    key: 'getActions',
    value: function getActions() {
      return this.events;
    }

    /**
     * Update a property based on a component ID.
     * @param {String} componentID The id of the component to change the property of.
     * @param {String} property The property of the component to be update.
     * @param {String} value The value to update the property to.
     */
    // updateComponentProperty (componentID, property, value) {
    //   var component = this.getEvent(componentID) || this.getAction(componentID) || this.getProperty(componentID);
    //   return component[property] = value;
    // }

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
      var _this6 = this;

      var schedule = later.parse.text(action.schedule);
      var scheduledAction = later.setInterval(function () {
        _this6.callAction(action.id);
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
      var _this7 = this;

      var schedule = later.parse.text(event.schedule);
      var scheduledEvent = later.setInterval(function () {
        _this7.callEvent(event.id);
      }, schedule);
      this.scheduledEvents.push(scheduledEvent);
      return scheduledEvent;
    }
  }]);
  return Thing;
}(EventEmitter);

;

export default Thing;
//# sourceMappingURL=Thing.es6.js.map