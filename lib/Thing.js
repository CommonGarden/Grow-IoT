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

    // if (!_.isUndefined(this.events)) {
    //   _.each(this.events, (event, key, list) => {
    //     if (!_.isUndefined(event.on)) {
    //       this.on(event.on, () => {
    //         event.function();
    //       });
    //     }
    //   });
    // }

    if (!_.isUndefined(this.start)) {
      this.start();
    }


    // if (!_.isUndefined(this.properties)) {
    //   for (var property in this.properties) {
    //     // If the property is a function we initialize it.
    //     if (typeof this.properties[property] === 'function') {
    //       this.properties[property] = this.properties[property]()
    //     }
    //   }
    // }

    // Callback is optional. May be used for a start function.
    // if (!_.isUndefined(callback)) {
    //   callback();
    // }
  }

  /**
   * Get an action object by key
   * @param {String} ID  The key of the action object you want.
   * @returns {Object}
   */
  // getAction (ID) {
  //   let action = {};
  //   _.each(this.actions, (value, key, list) => {
  //     if (key === ID) {
  //       return action = value;
  //     } else if (this.actions[key].id === ID) {
  //       return action = value; 
  //     }
  //   });

  //   if (_.isEmpty(action)) {
  //     return false;
  //   } else {
  //     return action;
  //   }
  // }

  /**
   * Get event object by key
   * @param {String} ID  The key / id of the event object you want.
   * @returns {Object}
   */
  // getEvent (ID) {
  //   let event = {}
  //   _.each(this.events, (value, key, list) => {
  //     if (key === ID) {
  //       return event = value;
  //     } else if (this.events[key].id === ID) {
  //       return event = value; 
  //     }
  //   });

  //   if (_.isEmpty(event)) {
  //     return false;
  //   } else {
  //     return event;
  //   }
  // }

  /**
   * Update a property based on a component ID.
   * @param {String} property The property of the component to be update.
   * @param {String} value The value to update the property to.
   * @param {String} key  Optional. Use to update the property of an event or action.
   */
  set (key, value) {
    // if (!_.isUndefined(this.properties[key])) {
    this.properties[key] = value;
    this.emit('property-updated', key);
    // }
    // else {
    //   // what if they both have the same key?
    //   let action = this.getAction(key);
    //   let event = this.getEvent(key);
    //   if (action) {
    //     action[property] = value;
    //   } else if (event) {
    //     event[property] = value;
    //   }
    //   this.emit('property-updated');    
    // }
  }

  /* Get a property by key.
   * @param {String} property
   * @returns {String} key  Optional. Use to get an event or action property.
   */
  get (key) {
    return this.properties[key];
  }

  /**
   * Calls a registered action or event function, emits event if the the action has an 'event'
   * property defined. 
   * @param      {String}  key The id of the action / event to call.
   * @param      {Object}  options Optional, options to call with the function.
   */
  call (key, options) {
    try {
      // let action = this.getAction(key);
      // let event = this.getEvent(key);

      // if (action) {
      if (!_.isUndefined(options)) {
        var output = this[key](options);
      }
      else {
        var output = this[key]();
      }
      this.emit(key);
      // }

      // else if (event) {
      //   if (!_.isUndefined(options)) {
      //     var output = event.function(options);
      //   }
      //   else {
      //     var output = event.function();
      //   }
      //   this.emit(key);
      // }

      // We return any returns of called functions for testing.
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
