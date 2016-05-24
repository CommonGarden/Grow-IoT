global.expect = require('chai').expect;

// require('babel/register');

(function setup () {
  beforeEach(function() {

    global.thing1 = {
      name: 'Light', // The display name for the thing.
      id: 'Light',
      username: 'YourUsernameHere', // The username of the account you want this device to be added to.
      properties: {
        state: 'off',
        lightconditions: function () {
          return 'unset';
        }
      },
      actions: [ // A list of action objects with ids
        {
          name: 'On', // Display name for the action
          description: 'Turns the light on.', // Optional description
          id: 'turn_light_on', // A unique id
          schedule: 'at 9:00am', // Optional scheduling using later.js
          event: 'Light turned on', // Optional event to emit when called.
          function: function () {
            // The implementation of the action.
            return 'Light on.';
          }
        },
        {
          name: 'off',
          id: 'turn_light_off',
          schedule: 'at 8:30pm',
          event: 'Light turned off',
          function: function () {
            return 'Light off.';
          }
        },
        {
          name: 'Log light data', // Events get a display name like actions
          id: 'light_data', // Events also get an id that is unique to the device
          type: 'light', // Currently need for visualization component... HACK.
          template: 'sensor',
          schedule: 'every 1 second', // Events should have a schedule option that determines how often to check for conditions.
          function: function () {
            // function should return the event to emit when it should be emited.
            return 10;
          }
        }
      ],
      events: [
        {
          name: 'It\'s dark.',
          id: 'dark',
          on: 'light_data', // Hook into an action.
          function: function () {
            return;
          }
        },
        {
          name: 'It\'s light.',
          id: 'light',
          on: 'light_data', // Hook into an action.
          function: function () {
            return;
          }
        }
      ]
    };

    global.thing2 = {
      name: 'Light', // The display name for the thing.
      id: 'Light',
      username: 'YourUsernameHere', // The username of the account you want this device to be added to.
      properties: { // These can be updated by the API.
        state: 'off',
        lightconditions: function () {
          return 'unset';
        }
      },
      actions: { // a list of action objects with keys
        turn_light_on: {
          name: 'On', // Display name for the action
          description: 'Turns the light on.', // Optional description
          schedule: 'at 9:00am', // Optional scheduling using later.js
          event: 'Light turned on', // Optional event to emit when called.
          function: function () {
            // The implementation of the action.
            return 'Light on.';
          }
        },
        turn_light_off: {
          name: 'off',
          schedule: 'at 8:30pm',
          event: 'Light turned off',
          function: function () {
            return 'Light off.';
          }
        },
        light_data: {
          name: 'Log light data', // Events get a display name like actions
          type: 'light', // Currently need for visualization component... HACK.
          template: 'sensor',
          schedule: 'every 1 second', // Events should have a schedule option that determines how often to check for conditions.
          function: function () {
            return 10;
          }
        }
      },
      events: {
        dark: {
          name: 'It\'s dark.',
          on: 'light_data', // Hook into an action.
          function: function () {
            return;
          }
        },
        light: {
          name: 'It\'s light.',
          on: 'light_data',
          function: function () {
            return;
          }
        }
      }
    }
  });

  afterEach(function() {
    delete global.thing1;
    delete global.thing2;
  });
})();
