const _ = require('underscore');
const EventEmitter = require('events');

/**
 * A Thing is an extension of [node's built-in EventEmitter class](https://nodejs.org/api/events.html).
 * @extends EventEmitter
 * @param {Object} config  an object containing metadata, properties, events, and/or actions.
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

    // Should it just be a 'start' property instead?
    if (!_.isUndefined(this.initialize)) {
      this.initialize();
      // Emit event to show that accessor has initialized and is ready.
      this.emit('ready');
    }
  }

  // Equivalent to inputList?
  methodList () {
    let methods = [];
    _.each(this, function (value, key, list) {
      if (typeof value === 'function') {
        methods.push(key);
      }
    });

    return methods;
  }

  // Equivalent to outputList?
  eventList () {
    let events = this.methodList();
    events.push('ready', 'property-updated');
    return events;
  }

  // Useful? Needed?
  listeners () {
    // returns a list of listeners.
    return this.events;
  }

  /**
   * Update a property. Emit an event.
   * @param {String} property The property of the component to be update.
   * @param {String} value The value to update the property to.
   * @param {String} key  Optional. Use to update the property of an event or action.
   */
  set (key, value) {
    this.properties[key] = value;
    this.emit('property-updated', key);
  }

  /* Get a property by key.
   * @param {String} property
   * @returns {String} key  Optional. Use to get an event or action property.
   */
  get (key) {
    // Should everything emit an event?
    return this.properties[key];
  }

  /**
   * Calls a method, emits event
   * property defined. 
   * @param      {String}  key The id of the action / event to call.
   * @param      {Object}  options Optional, options to call with the function.
   */
  call (key, options) {
    try {
      if (!_.isUndefined(options)) {
        var output = this[key](options);
      }
      else {
        var output = this[key]();
      }
      this.emit(key, options);

      // We return any returns of called functions.
      if (!_.isUndefined(output)) {
        return output;
      }
    }
    catch (error) {
      console.log(error);
    }
  }
};

module.exports = Thing;
