// THIS SHOULD BE RUN IN A SEPERATE TERMINAL INSTANCE.
// Pretend it's a Raspberry pi running the script.

// Import the latest build of the Grow.js library
var GrowInstance = require('./dist/Grow.umd.js');

// Create a new grow instance.
var grow = new GrowInstance({
    uuid: 'b0055c44-241f-4edd-89cc-8616beded7a1',
    token: 'EvbcKyytoR5AATju6hGAHT9Ferg6p4SB',
    webcomponent: 'test-thing',

    // Properties can be updated by the API
    properties: {
        prop1: {
          type: String,
          value: 'test-thing'
        }
    },

    start: function () {
        console.log('test-thing started');
    },

    testbutton: function () {
        console.log('Test successful.');
    }
});

// Connects by default to localhost:3000
grow.connect();
