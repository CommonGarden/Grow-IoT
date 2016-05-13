const _ = require('underscore');
const later = require('later');
const EventEmitter = require('events');

class Thing extends EventEmitter {
  /**
   * Constructs a new thing object.
   * @param {Object} config
   * @return     A new events object
  */
  constructor(config) {
    super();

    if (!config) {
      throw new Error('Thing.js requires an config object.');
    } else {
      _.extend(this, config);
    }

    console.log(this);

    // Register actions events
    this.registerActions();
    this.registerEvents();
  }

  /**
   * Registers actions and returns a new actions object
   * @param {Object} thing  
   * @return     A new grow instance.
 */
  registerActions () {
    // this.actions = [];
    this.scheduledActions = [];

    // this.emit = thing.emit;

    // for (var key in thing) {
    //   // Check top level thing model for actions.
    //   if (key === 'actions') {
    //     for (var action in thing[key]) {
    //       this.actions.push(thing[key][action]);
    //     }
    //   }
    // }

    for (var action in this.actions) {
      var actionId = this.actions[action].id;
      var action = this.getActionByID(actionId);
      if (!_.isUndefined(action)) {
        this.startAction(actionId);
      }
    }

    return this;
  }

  /**
   * Get action object based on the action id
   * @param {String} actionId  The id of the action object you want.
   * @returns {Object}
   */
  getActionByID (actionId) {
    for (var i = this.actions.length - 1; i >= 0; i--) {
      if (this.actions[i].id === actionId) {
        return this.actions[i];
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
  callAction (actionId, options) {
    var action = this.getActionByID(actionId);

    this.emit(actionId)

    if (!_.isUndefined(options)) {
      return action.function(options);
    }
    else {
      return action.function();
    }
  }

  /**
   * Starts a reoccurring action if a schedule property is defined.
   * @param {Object} action An action object.
   */
  startAction (action) {
    var meta = this.getActionByID(action);
    if (!_.isUndefined(meta.schedule)) {
      var schedule = later.parse.text(meta.schedule);
      var scheduledAction = later.setInterval(()=> {this.callAction(action);}, schedule);
      this.scheduledActions.push(scheduledAction);
      return scheduledAction;
    }
  }

    /**
   * Register a new events object.
   * @param {Object} thing  
   * @return     A new events object
 */
  registerEvents (thing) {
    this.events = [];
    this.scheduledEvents = [];

    // this.emit = thing.emit;

    for (var key in thing) {
      // Check top level thing model for events.
      if (key === 'events') {
        for (var event in thing[key]) {
          this.events.push(thing[key][event]);
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
  }

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
  }

  /**
   * Calls a registered event function.
   * @param      {String}  eventId The id of the event to call.
   * @param      {Object}  options Optional, options to call with the function.
  */
  callEvent (eventId, options) {
    var event = this.getEventByID(eventId);

    this.emit(eventId);

    if (!_.isUndefined(options)) {
      return event.function(options);
    }
    else {
      return event.function();
    }
  }

  /**
   * Starts a reoccurring event if a schedule property is defined.
   * @param {Object} event An event object.
   */
  startEvent (event) {
    var meta = this.getEventByID(event);
    if (!_.isUndefined(meta.schedule)) {
      var schedule = later.parse.text(meta.schedule);
      var scheduledEvent = later.setInterval(()=> {this.callEvent(event);}, schedule);
      this.scheduledEvents.push(scheduledEvent);
      return scheduledEvent;
    }
  }
};

export default Thing;
