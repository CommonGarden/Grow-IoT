// Import the latest build of the Grow.js library
var Thing = require('../.././dist/Thing.umd.js');

// Declare need variable for example
var currentLightValue;
var currentTempValue;

// Create a new light instance. Connects by default to localhost:3000
var light = new Thing({
    uuid: '5b7ba90f-ce42-44e4-9ecb-fcb256b89352',
    token: 'mGQknLsQM4fyeJWYNCPebEqQH3SCxgcP',
    name: 'Light', // The display name for the thing.
    desription: 'An LED light with a basic on/off api.',

    // Properties can be updated by the API
    properties: {
        state: {
            type: String,
            value: 'off'
        },
        lightConditions: String
    },

    // Actions are the API of the thing.
    actions: {
        turn_light_on: {
            name: 'On', // Display name for the action
            description: 'Turns the light on.', // Optional description
            schedule: 'at 9:00am', // Optional scheduling using later.js
            // Is this rule pattern useful?
            function: function () {
                // Emit a 'light off' event, set state to on.
                light.emitEvent('Light on').set('state', 'on');
                console.log('Light on');
            }
        },
        turn_light_off: {
            name: 'off',
            schedule: 'at 8:30pm', // Run this function at 8:30pm
            function: function () {
                // Emit a 'light off' event, set the state property to 'off'
                light.emitEvent('Light off').set('state', 'off');
                console.log('Light off');
            }
        }
    },
    events: {
        temp_data: {
            name: 'Log temperature data',
            type: 'temperature',
            template: 'sensor',
            schedule: 'every 1 second',
            function: function () {
                currentTempValue = Math.random();

                // // Send data to the Grow-IoT app.
                light.log({
                  type: 'temperature',
                  value: currentTempValue
                });
            }
        },
        light_data: {
            name: 'Log light data',
            type: 'light',
            template: 'sensor',
            schedule: 'every 1 second',
            function: function () {
                currentLightValue = Math.random();

                // Send data to the Grow-IoT app.
                light.log({
                  type: 'light',
                  value: currentLightValue
                });
            }
        }
    }
});
