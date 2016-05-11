/**
 * # Actions
 * 
 * Example:
 * ```
 *  "actions": [ // A list of action objects
 *     {
 *         "name": "On", // Display name for the action
 *         "description": "Turns the light on.", // Optional description
 *         "id": "turn_light_on", // A unique id
 *         "updateState": "on", // Updates state on function call
 *         "schedule": "at 9:00am", // Optional scheduling using later.js
 *         "event": "Light turned on", // Optional event to emit when called.
 *         "function": function () {
 *             // The implementation of the action.
 *             LED.high();
 *             console.log("Light on.");
 *         }
 *     }
 *   ]
 * ```
 */

const _ = require('underscore');
const later = require('later');

var Actions = {
  /**
   * Registers actions and returns a new actions object
   * @param {Object} config  
   * @return     A new grow instance.
 */
  register (config) {
    this.actions = [];
    this.scheduledActions = [];

    for (var key in config) {
      // Check top level thing model for actions.
      if (key === 'actions') {
        for (var action in config[key]) {
          this.actions.push(config[key][action]);
        }
      }
    }

    for (var action in this.actions) {
      var actionId = this.actions[action].id;
      var action = this.getActionByID(actionId);
      if (!_.isUndefined(action)) {
        this.startAction(actionId);
      }
    }

    return this;
  },

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
  },

  /**
   * Calls a registered action, emits event if the the action has an 'event'
   * property defined. Updates the state if the action has an 'updateState'
   * property specified.
   * @param      {String}  actionId The id of the action to call.
   * @param      {Object}  options Optional, options to call with the function.
  */
  callAction (actionId, options) {
    var action = this.getActionByID(actionId);

    if (!_.isUndefined(options)) {
      return action.function(options);
    }
    else {
      return action.function();
    }
  },

  /**
   * Starts a reoccurring action if a schedule property is defined.
   * @param {Object} action An action object.
   */
  startAction (action) {
    var meta = this.getActionByID(action);
    if (!_.isUndefined(meta.schedule)) {
      var schedule = later.parse.text(meta.schedule);
      var scheduledAction = later.setInterval(function() {this.callAction(action);}, schedule);
      this.scheduledActions.push(scheduledAction);
      return scheduledAction;
    }
  }
};

export default Actions;
