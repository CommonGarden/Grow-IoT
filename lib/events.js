/**
 * # Events
 * Events are functions that return a value to emit as event or doesn't return 
   (in which case no event is emitted). 

 * NOTE: Events currently run like jobs and so REQUIRE a schedule property. 
   This is not nice, let's rewrite.
 
 * The "events" property of the config object takes a list of event objects. For example:

        "events": [
            {
                "name": "Light data",
                "id": "light_data",
                "schedule": "every 1 second",
                "function": function () {
                    // function should return the event to emit when it should be emited.
                    return lightSensor.value;
                }
            }
        ]
 */

const _ = require('underscore');
const later = require('later');

var Events = {
  /**
   * Register a new events object.
   * @param {Object} config  
   * @return     A new events object
 */
  register (config) {
    this.events = [];
    this.scheduledEvents = [];

    for (var key in config) {
      // Check top level thing model for events.
      if (key === 'events') {
        for (var event in config[key]) {
          this.events.push(config[key][event]);
        }
      }
    }

    for (var event in this.events) {
      var eventId = this.events[event].id;
      var event = this.getEventByID(eventId);
      if (!_.isUndefined(event)) {
        this.startEvent(eventId);
      }
    }

    return this;
  },

  // THOUGHT: since this is the same for actions an events, could it just be 'getComponentById'?
  /**
   * Get event object based on the event id
   * @param {String} eventId  The id of the event object you want.
   * @returns {Object}
   */
  getEventByID (eventId) {
    for (var i = this.events.length - 1; i >= 0; i--) {
      if (this.events[i].id === eventId) {
        return this.events[i];
      }
    }
  },

  /**
   * Calls a registered event, emits event if the the event has an 'event'
   * property defined. Updates the state if the event has an 'updateState'
   * property specified.
   * @param      {String}  eventId The id of the event to call.
   * @param      {Object}  options Optional, options to call with the function.
  */
  callEvent (eventId, options) {
    var event = this.getEventByID(eventId);

    if (!_.isUndefined(options)) {
      return event.function(options);
    }
    else {
      return event.function();
    }
  },

  /**
   * Starts a reoccurring event if a schedule property is defined.
   * @param {Object} event An event object.
   */
  startEvent (event) {
    var meta = this.getEventByID(event);
    if (!_.isUndefined(meta.schedule)) {
      var schedule = later.parse.text(meta.schedule);
      var scheduledEvent = later.setInterval(function() {this.callEvent(event);}, schedule);
      this.scheduledEvents.push(scheduledEvent);
      return scheduledEvent;
    }
  }
};

export default Events;
