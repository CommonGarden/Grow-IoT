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

    // What would be other useful default methods?
    if (!_.isUndefined(this.start)) {
      this.start();
    }
  }

  /**
   * Update a property based on a component ID.
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

export default Thing;
