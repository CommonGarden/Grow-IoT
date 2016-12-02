// Import the latest build of the Grow.js library
var Thing = require('Grow.js');

// Create a new grow instance. Connects by default to localhost:3000
var testDevice = new Thing({
    // PUT YOUR UUID AND TOKEN HERE:
    uuid: '074474bf-afd2-4b20-8c64-553ea6e7605d',
    token: '9ZP35fqHN4HvPA5xipvx6iL3Zqn3tbGq',
    
    // HACK, unfortunately needed for now...
    testDevice: true,

    // Properties can be updated by the API
    properties: {
        state: 'off'
    },

    start: function () {
        setInterval(()=> {
            testDevice.call('temp_data');
        }, 3000);
    },

    turn_on: function () {
        testDevice.set('state', 'on');
    },

    turn_off: function () {
        testDevice.set('state', 'off');
    },

    temp_data: function () {
        let temp = Math.random() * 100;

        // Send data to the Grow-IoT app.
        testDevice.emit({
          type: 'temperature',
          value: temp
        });
    }
});

testDevice.connect();
