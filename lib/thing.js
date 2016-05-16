const _ = require('underscore');
const later = require('later');
const EventEmitter = require('events');

class Thing extends EventEmitter {
  /**
   * Constructs a new thing object.
   * @param {Object} config a javascript object containing properties, events, and actions
   * @return     A new thing object
  */
  constructor(config) {
    super();

    if (!config) {
      throw new Error('Thing.js requires an config object.');
    } else {
      _.extend(this, config);
    }

    this.registerActions();
    this.registerEvents();
  }

  /**
   * Starts any scheduled actions.
   * Todo: should also throw errors if actions don't have IDs or functions.
   */
  registerActions () {
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
  registerEvents () {
    this.scheduledEvents = [];

    // Check top level thing model for events.
    if (!_.isUndefined(this.events)) {
      for (var event in this.events) {
        event = this.events[event];
        
        if (!_.isUndefined(event.schedule)) {
          this.scheduleEvent(event);
        }

        if (!_.isUndefined(event.on)) {
          this.on(event.on, () => {
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
  getComponentByID (ID) {
    // Check top level component
    if (this.id === ID) {
      return this;
    }

    // Check action and event components
    else {
      return _.findWhere(this.actions, {id: ID}) || _.findWhere(this.events, {id: ID});
    }
  }

  /**
   * Update a property based on a component ID.
   * @param {String} componentID The id of the component to change the property of.
   * @param {String} property The property of the component to be update.
   * @param {String} value The value to update the property to.
   */
  updateProperty (componentID, property, value) {
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
  callAction (actionId, options) {
    try {
      var action = this.getComponentByID(actionId);

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
  startAction (action) {
    // do we need to make the redundent call to getActionByID?
    var schedule = later.parse.text(action.schedule);
    var scheduledAction = later.setInterval(()=> {this.callAction(action.id);}, schedule);
    this.scheduledActions.push(scheduledAction);
    return scheduledAction;
  }

  /**
   * Starts a reoccurring event if a schedule property is defined.
   * @param {Object} event An event object.
   */
  scheduleEvent (event) {
    var schedule = later.parse.text(event.schedule);
    var scheduledEvent = later.setInterval(()=> {this.callEvent(event.id);}, schedule);
    this.scheduledEvents.push(scheduledEvent);
    return scheduledEvent;
  }
};

export default Thing;
