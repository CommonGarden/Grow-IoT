// Import the latest build of the Grow.js library
var GrowInstance = require('Grow.js');

// Create a new grow instance. Connects by default to localhost:3000
var grow = new GrowInstance({
    uuid: '',
    token: '',

    // Properties can be updated by the API
    properties: {
        state: 'off'
    },

    start: function () {
        setInterval(temp_data, 3000);
    },

    turn_light_on: function () {
        grow.set('state', 'on');
    },

    turn_light_off: function () {
        grow.set('state', 'off');
    },

    temp_data: function () {
        let temp = Math.random() * 100;

        // Send data to the Grow-IoT app.
        grow.temp_data({
          type: 'temperature',
          value: temp
        });
    }
});

grow.connect();
