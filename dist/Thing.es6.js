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
   * @param {Object} config a javascript object containing properties, events, and actions
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

export default Thing;
//# sourceMappingURL=Thing.es6.js.map