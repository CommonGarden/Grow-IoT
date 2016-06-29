// Import the grow.js library.
var GrowInstance = require('../.././dist/Grow.umd.js');

// Declare need variable for example
var currentLightValue;
var currentTempValue;

// Create a new grow instance. Connects by default to localhost:3000
// Create a new grow instance.
var grow = new GrowInstance({
    name: 'Light', // The display name for the thing.
    desription: 'An LED light with a basic on/off api.',

    // The username of the account you want this device to be added to.
    username: 'jake2@gmail.com',

    // Properties can be updated by the API
    properties: {
        state: 'off'
    },

    // Actions are the API of the thing.
    actions: {
        turn_light_on: {
            name: 'On', // Display name for the action
            description: 'Turns the light on.', // Optional description
            schedule: 'at 9:00am', // Optional scheduling using later.js
            // Is this rule pattern useful?
            function: function () {
                console.log('Light on');

                // Emit a 'light off' event
                grow.emitEvent('Light on');

                // Set the state property to 'off'
                grow.setProperty('state', 'on');
            }
        },
        turn_light_off: {
            name: 'off',
            schedule: 'at 8:30pm', // Run this function at 8:30pm
            function: function () {
                console.log('Light off');

                // Emit a 'light off' event
                grow.emitEvent('Light off');

                // Set the state property to 'off'
                grow.setProperty('state', 'off');
            }
        },
        light_data: {
            name: 'Log light data',
            // type and template need for visualization component... HACK. 
            type: 'light',
            template: 'sensor',
            schedule: 'every 1 second',
            function: function () {
                currentLightValue = Math.random();

                // Send data to the Grow-IoT app.
                grow.sendData({
                  type: 'light',
                  value: currentLightValue
                });
            }
        },
        temp_data: {
            name: 'Log temperature data',
            // type and template need for visualization component... HACK. 
            type: 'temperature',
            template: 'sensor',
            schedule: 'every 1 second',
            function: function () {
                currentTempValue = Math.random();

                // Send data to the Grow-IoT app.
                grow.sendData({
                  type: 'temperature',
                  value: currentTempValue
                });
            }
        }
    },
    events: {
        min_light: {
            name: 'Check light level',
            on: 'light_data',
            options: {
                min_value: 0.25,
                max_value: 1,
                state: null
            },
            disable: false,
            function: function () {
                var options = grow.getProperty('options', 'min_light');
                if (currentLightValue < options.min_light && options.state !== 'dark') {
                    grow.emitEvent('Light level low');
                } else if (currentLightValue > options.max) {
                    grow.emitEvent('Full Sunlight');
                }
            }
        }
    }
});

