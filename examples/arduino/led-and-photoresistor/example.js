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
        lightSensorPower = new five.Pin(0);
        lightSensor = new five.Sensor('A0');

    // Hack because my board is broken.
    lightSensorPower.high();

    // Create a new grow instance.
    var grow = new GrowInstance({
        name: 'LED and photoresistor', // The display name for the thing.
        desription: 'An LED light with a basic on/off api.',
        username: 'jake2@gmail.com', // The username of the account you want this device to be added to.
        properties: {
            state: 'off',
            lightconditions: null
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
                    grow.set('state', 'on');
                }
            },
            turn_light_off: {
                name: 'off',
                schedule: 'at 8:30pm',
                function: function () {
                    LED.low();
                    console.log('light off');
                    grow.set('state', 'off');
                }
            },
            light_data: {
                name: 'Log light data', 
                type: 'light', // Currently need for visualization component... HACK.
                template: 'sensor',
                schedule: 'every 1 second',
                function: function () {
                    // console.log(lightSensor.value);
                    grow.log({
                      type: 'light',
                      value: lightSensor.value
                    });
                }
            }
        }//,
        // events: {
        //     check_light_data: {
        //         name: 'Check light data',
        //         on: 'light_data', // Adds Listener for action event.
        //         threshold: 100,
        //         function: function () {
        //             var threshold = grow.get('threshold', 'check_light_data');
        //             if ((lightSensor.value < threshold) && (grow.get('lightconditions') != 'dark')) {
        //                 // This could be nice with a chaining API...
        //                 // It would be good if we could add additional rules with the environment.
        //                 // EventListeners
        //                 grow.emitEvent('dark');
        //                 grow.set('lightconditions', 'dark');
        //                 grow.call('turn_light_on');
        //             } else if ((lightSensor.value >= threshold) && (grow.get('lightconditions') != 'light')) {
        //                 // This could be nice with a chaining API...
        //                 grow.emitEvent('light');
        //                 grow.set('lightconditions', 'light');
        //                 grow.call('turn_light_off');
        //             }
        //         }
        //     }
        // }
    });
});
