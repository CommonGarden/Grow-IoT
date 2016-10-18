// THIS SHOULD BE RUN IN A SEPERATE TERMINAL INSTANCE.
// Pretend it's a Raspberry pi running the script.

// Import the latest build of the Grow.js library
var GrowInstance = require('./dist/Grow.umd.js');

// Create a new grow instance.
var grow = new GrowInstance({
    uuid: 'c592bb25-fb6a-4b34-9691-bb48ee839b9e',
    token: 'Ybdsdjsv6HHscvi4qgirsrLD7JHiL8vT',
    webcomponent: 'test-thing', // Hack

    // Properties can be updated by the API
    properties: {
        prop1: {
          type: String,
          value: 'test-thing'
        }
    },

    // Actions are the API of the thing, these are called from the webcomponent
    actions: {
        testbutton: {
            function: function () {
                console.log('Test successful.');
            }
        }
    }
});

// Connects by default to localhost:3000
grow.connect();
