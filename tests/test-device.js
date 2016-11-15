// Import the latest build of the Grow.js library
var GrowInstance = require('Grow.js');

// Declare need variable for example
var currentLightValue;

// Create a new grow instance. Connects by default to localhost:3000
var grow = new GrowInstance({
    uuid: '',
    token: '',

    // Properties can be updated by the API
    properties: {
        name: 'Light and photoresistor', // The display name for the thing.
        desription: 'An LED light with a basic on/off api.',
        state: 'off',
        lightConditions: null,
        light_data_interval: 3000
    },

    start: function () {
        setInterval(light_data, 3000);
    }

    // Actions are the API of the thing.
    turn_light_on: function () {
        grow.set('state', 'on');
    },

    turn_light_off: function () {
        // Emit a 'light off' event, set the state property to 'off'
        grow.set('state', 'off');
    },

    light_data: function () {
        currentLightValue = Math.random();

        // Send data to the Grow-IoT app.
        // TODO: if a method returns a value, emit that value.
        grow.emit({
          type: 'light',
          value: currentLightValue
        });
    }
});

grow.connect();
