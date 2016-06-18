// Require the Grow.js build and johnny-five library.
var GrowInstance = require('../../../dist/Grow.umd.js');
var five = require('johnny-five');

// Create a new board object
var board = new five.Board();

// When board emits a 'ready' event run this start function.
board.on('ready', function start() {
    // Define variables
    // Note: if you wire the device slightly differently you may need to
    // change the pin numbers below.
    var LED = new five.Pin(13),
        lightSensor = new five.Sensor('A0');

    // Create a new grow instance.
    var grow = new GrowInstance({
        name: 'Light', // The display name for the thing.
        desription: 'An LED light with a basic on/off api.',
        username: 'jake2@gmail.com', // The username of the account you want this device to be added to.
        properties: {
            state: 'off',
            lightconditions: function () {
                // Properties can be functions, booleans, strings, ints, objects, lists, etc.
                // Properties can be updated by the API.
                // Note: property functions should return a value.

                return 'unset';
            }
        },
        actions: {
            turn_light_on: {
                name: 'On', // Display name for the action
                description: 'Turns the light on.', // Optional description
                schedule: 'at 9:00am', // Optional scheduling using later.js
                function: function () {
                    // The implementation of the action.
                    LED.high();
                    console.log('light on');
                    grow.setProperty('state', 'on');
                }
            },
            turn_light_off: {
                name: 'off',
                schedule: 'at 8:30pm',
                function: function () {
                    LED.low();
                    console.log('light off');
                    grow.setProperty('state', 'off');
                }
            },
            light_data: {
                name: 'Log light data', 
                type: 'light', // Currently need for visualization component... HACK.
                template: 'sensor',
                schedule: 'every 1 second',
                function: function () {
                    // console.log(lightSensor.value);
                    grow.sendData({
                      type: 'light',
                      value: lightSensor.value
                    });
                }
            }
        },
        events: {
            check_light_data: {
                name: 'Check light data',
                on: 'light_data', // Adds Listener for action event.
                function: function () {
                    if ((lightSensor.value < 100) && (grow.thing.getProperty('lightconditions') != 'dark')) {
                        // This could be nice with a chaining API...
                        // It would be good if we could add additional rules with the environment.
                        // EventListeners
                        grow.emitEvent('dark');
                        grow.setProperty('lightconditions', 'dark');
                        grow.callAction('turn_light_on');
                    } else if ((lightSensor.value >= 100) && (grow.thing.getProperty('lightconditions') != 'light')) {
                        // This could be nice with a chaining API...
                        grow.emitEvent('light');
                        grow.setProperty('lightconditions', 'light');
                        grow.callAction('turn_light_off');
                    }
                }
            }
        }
    });

    setTimeout(()=> {
        grow.updateActionProperty('light_data', 'schedule', 'every 5 seconds');
    }, 5000);
});
