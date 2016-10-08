// Import the latest build of the Grow.js library
var GrowInstance = require('../.././dist/Grow.umd.js');

// Declare need variable for example
var currentLightValue;
var currentTempValue;

// Create a new grow instance. Connects by default to localhost:3000
var grow = new GrowInstance({
    name: 'Light', // The display name for the thing.
    desription: 'An LED light with a basic on/off api.',

    // Properties can be updated by the API
    properties: {
        state: 'off',
        lightConditions: null
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
                grow.emitEvent('Light on').set('state', 'on');
                console.log('Light on');
            }
        },
        turn_light_off: {
            name: 'off',
            schedule: 'at 8:30pm', // Run this function at 8:30pm
            function: function () {
                // Emit a 'light off' event, set the state property to 'off'
                grow.emitEvent('Light off').set('state', 'off');
                console.log('Light off');
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
                grow.log({
                  type: 'light',
                  value: currentLightValue
                });
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
                grow.log({
                  type: 'temperature',
                  value: currentTempValue
                });
            }
        }
    }
});

grow.connect();
