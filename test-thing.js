// THIS SHOULD BE RUN IN A SEPERATE TERMINAL INSTANCE.
// Pretend it's a Raspberry pi running the script.

// Import the latest build of the Grow.js library
var GrowInstance = require('./dist/Grow.umd.js');

// Create a new grow instance.
var grow = new GrowInstance({
    uuid: 'd9665f70-4415-4996-9690-bdaeaf70ea1b',
    token: 'tXatXNdoEKt947MZF3bEJPWkT49C4sHt',
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
