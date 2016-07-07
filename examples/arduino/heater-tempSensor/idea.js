// Require the Grow.js build and johnny-five library.
var Accessor = require('../../../dist/Grow.umd.js');
var five = require('johnny-five');
var ascii = require('ascii-codes');

// Create a new board object
var board = new five.Board();

// When board emits a 'ready' event run this start function.
board.on('ready', function start() {
    // http://johnny-five.io/examples/multi-mpl3115a2/
    var multi = new five.Multi({
        controller: "MPL3115A2",
        // Change `elevation` with whatever is reported
        // on http://www.whatismyelevation.com/.
        // `12` is the elevation (meters) for where I live in Brooklyn
        elevation: 133
    });

    // Declare variables
    var heater = new five.Pin(13);

    // Create a new grow instance.
    var @ = new Accessor({
        name: 'Heater', // The display name for the thing.
        desription: 'Space heater and temperature sensor control system',
        username: 'jake2@gmail.com', // The username of the account you want this device to be added to.
        inputs: {
            turn_heater_on: {
                name: 'heater On', // Display name for the action
                description: 'Turns the heater on.', // Optional description
                function: function () {
                    // The implementation of the action.
                    heater.high();
                    @.set('state', 'on');
                }
            },
            turn_heater_off: {
                name: 'heater off',
                function: function () {
                    heater.low();
                    @.set('state', 'off');
                }
            },
            temp_data: {
                name: 'Temperature sensor', 
                template: 'sensor',
                type: 'temperature',
                schedule: 'every 4 seconds',
                function: function () {
                    // // Send value to Grow-IoT
                    @.log({
                      type: 'temperature',
                      value: multi.temperature.celsius
                    });
                }
            }
        },
        outputs: {
            check_temp: {
                name: 'Turn on heater when temperature less than',
                on: 'temp_data', // action registers as event listener?
                threshold: 25,
                heaterstate: null
                function: function () {
                    var threshold = @.get('threshold', 'check_temp');
                    var state = @.get('heaterstate', 'check_temp')
                    if (multi.temperature.celsius < threshold && state !== 'on' ) {
                        @.emitEvent('Too cold')
                         .call('turn_heater_on')
                         .set('heaterstate', 'on', 'check_temp');
                    }
                }
            }
        }
    });
});
