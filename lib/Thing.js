const _ = require('underscore');
const later = require('meteor-later');
const EventEmitter = require('events');

/**
 * A Thing is an extension of [node's built-in EventEmitter class](https://nodejs.org/api/events.html).
 * @extends EventEmitter
 * @param {Object} config  an object containing properties, events, and/or actions.
 * @param {Function} callback  an optional callback
 * @return     A new thing object
 */
class Thing extends EventEmitter {
  constructor(config, callback) {
    super();

    if (!config) {
      throw new Error('Thing.js requires an config object.');
    } else {
      _.extend(this, config);
    }

    this.scheduledActions = {};

    if (!_.isUndefined(this.actions)) {
      _.each(this.actions, (action, key, list) => {
        if (!_.isUndefined(action.schedule)) {
          this.scheduleAction(key);
        }
      });
    }

    this.scheduledEvents = {};

    if (!_.isUndefined(this.events)) {
      _.each(this.events, (event, key, list) => {
        if (!_.isUndefined(event.schedule)) {
          this.scheduleEvent(key);
        }

        if (!_.isUndefined(event.on)) {
          this.on(event.on, () => {
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

    if (!_.isUndefined(this.properties)) {
      for (var property in this.properties) {
        // If the property is a function we initialize it.
        if (typeof this.properties[property] === 'function') {
          // Note this function should return property value.
          this.properties[property] = this.properties[property]()
        }
      }
    }

    // Callback is optional. May be used for a start function.
    if (!_.isUndefined(callback)) {
      callback();
    }
  }

  /**
   * Get action object
   * @param {String} ID  The key of the action object you want.
   * @returns {Object}
   */
  getAction (ID) {
    let action = {};
    _.each(this.actions, (value, key, list) => {
      if (key === ID) {
        return action = value;
      } else if (this.actions[key].id === ID) {
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
  getEvent (ID) {
    let event = {}
    _.each(this.events, (value, key, list) => {
      if (key === ID) {
        return event = value;
      } else if (this.events[key].id === ID) {
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
  set (property, value, key) {
    if (_.isUndefined(key)) {
      this.properties[property] = value;
      this.emit('property-updated');
    }
    else {
      // what if they both have the same key?
      let action = this.getAction(key);
      let event = this.getEvent(key);
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
  get (property, key) {
    if (_.isUndefined(key)) {
      return this.properties[property];
    } else {
      let action = this.getAction(key);
      let event = this.getEvent(key);
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
  call (actionId, options) {
    try {
      let action = this.getAction(actionId);

      if (!_.isUndefined(options)) {
        var output = action.function(options);
      }
      else {
        var output = action.function();
      }
      this.emit(actionId);

      // We return any returns of called functions for testing.
      if (!_.isUndefined(output)) {
        return output;
      }
    }
    catch (error) {
      // If there is an error we emit an error.
      return this.emit('error', error);
    }

  }

  /**
   * Starts a reoccurring action if a schedule property is defined.
   * @param {Object} action An action object.
   */
  scheduleAction (actionKey) {
    let action = this.getAction(actionKey);
    let schedule = later.parse.text(action.schedule);
    let scheduledAction = later.setInterval(()=> {this.callAction(actionKey);}, schedule);
    return this.scheduledActions[actionKey] = scheduledAction;
  }

  /**
   * Starts a reoccurring event if a schedule property is defined.
   * @param {Object} event An event object.
   */
  scheduleEvent (eventKey) {
    let event = this.getEvent(eventKey)
    let schedule = later.parse.text(event.schedule);
    let scheduledEvent = later.setInterval(()=> {this.callEvent(eventKey);}, schedule);
    return this.scheduledEvents[eventKey] = scheduledEvent;
  }
};

export default Thing;
