// Import the latest build of the Grow.js library
var GrowInstance = require('../.././dist/Grow.umd.js');

// Declare need variable for example
var currentLightValue;

// Create a new grow instance. Connects by default to localhost:3000
var grow = new GrowInstance({
    uuid: '5b7ba90f-ce42-44e4-9ecb-fcb256b89352',
    token: 'mGQknLsQM4fyeJWYNCPebEqQH3SCxgcP',

    // Properties can be updated by the API
    properties: {
        name: 'Light and photoresistor', // The display name for the thing.
        desription: 'An LED light with a basic on/off api.',
        state: 'off',
        lightConditions: null,
        light_data_interval: 3000
    },

    // Actions are the API of the thing.
    turn_light_on: function () {
        grow.set('state', 'on');
        console.log('Light on');
    },

    turn_light_off: function () {
        // Emit a 'light off' event, set the state property to 'off'
        grow.set('state', 'off');
        console.log('Light off');
    },

    light_data: function () {
        currentLightValue = Math.random();

        // Send data to the Grow-IoT app.
        // TODO: if a method returns a value, emit that value.
        return {
          type: 'light',
          value: currentLightValue
        };
    }
});

grow.connect();
