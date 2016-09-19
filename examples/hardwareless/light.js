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
    username: 'jake.hartnell@gmail.com',

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
        },
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
    },
    events: {
        check_light: {
            name: 'Check light level',
            on: 'light_data',
            min: 0.25,
            max: 0.76,
            disable: false,
            function: function () {
                var min = grow.get('min', 'check_light'),
                    max = grow.get('max', 'check_light'),
                    lightConditions = grow.get('lightConditions');

                if (currentLightValue < min && lightConditions !== 'dark') {
                    grow.emitEvent('Light level low')
                        .set('lightConditions', 'dark')
                        .call('turn_light_on');
                } else if (currentLightValue > max && lightConditions !== 'light') {
                    grow.emitEvent('Full Sunlight')
                        .set('lightConditions', 'light')
                        .call('turn_light_off');
                }
            }
        }
    }
});

grow.connect();
