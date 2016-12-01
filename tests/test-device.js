// Import the latest build of the Grow.js library
var GrowInstance = require('Grow.js');

// Create a new grow instance. Connects by default to localhost:3000
var grow = new GrowInstance({
    uuid: 'ae3093d5-f6bb-47dd-911b-427e85b7d991',
    token: 'BmGKqZTh4MRzXMwPNeoqjNLLvFT6yQyG',
    testThing: true, // HACK

    // Properties can be updated by the API
    properties: {
        state: 'off'
    },

    start: function () {
        setInterval(()=> {
            grow.call('temp_data');
        }, 3000);
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
        grow.emit({
          type: 'temperature',
          value: temp
        });
    }
});

grow.connect();
