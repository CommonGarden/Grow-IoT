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

    this.emit = (event) => {
      super.emit(event);

      if (typeof event === 'object') {
        event.timestamp = new Date();
      }

      else if (typeof event === 'string') {
        event = {
          event,
          timestamp: new Date()
        }
      }
    };

    // Should it just be a 'start' property instead?
    if (!_.isUndefined(this.initialize)) {
      this.initialize();
    }

    // Not sure if this should be deprecated, but I'll leave this here for now. Thoughts?
    if (!_.isUndefined(this.start)){
      this.start();
    }
    
    // Emit 'ready' event to show that accessor has initialized.
    this.emit('ready');
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
   * @param      {String}  method The method to call.
   * @param      {Object}  options Optional, options to call with the function.
   * @returns    {Object}  output Returns any returns of the called method. 
   */
  call (method, options) {
    try {
      if (!_.isUndefined(options)) {
        var output = this[method](options);
      }
      else {
        var output = this[method]();
      }

      if (!_.isUndefined(output)) {
        this.emit(method, options, output);
        // We return any returns of called functions.
        return output;
      } else {
        this.emit(method, options);
      }
    }
    catch (error) {
      console.log(error);
    }
  }
};

module.exports = Thing;
