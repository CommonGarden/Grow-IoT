// Require the Grow.js build and johnny-five library.
var GrowInstance = require('../../../dist/Grow.umd.js');
var five = require('johnny-five');
var ascii = require('ascii-codes');

// Create a new board object
var board = new five.Board();

// When board emits a 'ready' event run this start function.
board.on('ready', function start() {
    // This must be called prior to any I2C reads or writes.
    this.i2cConfig();

    // Declare variables
    var DO_reading;
    var pH_reading;

    var airpump = new five.Pin(13);

    // Create a new grow instance.
    var grow = new GrowInstance({
        name: 'Breath', // The display name for the thing.
        desription: 'Atlas Scientific Disolved Oxygen sensor + Airpump',
        username: 'jake2@gmail.com', // The username of the account you want this device to be added to.
        properties: {
            state: null,
        },
        actions: {
            turn_pump_on: {
                name: 'Airpump On', // Display name for the action
                description: 'Turns the pump on.', // Optional description
                schedule: 'at 9:00am', // Optional scheduling using later.js
                function: function () {
                    // The implementation of the action.
                    airpump.high();
                    grow.set('state', 'on');
                }
            },
            turn_pump_off: {
                name: 'Airpump off',
                schedule: 'at 8:30pm',
                function: function () {
                    airpump.low();
                    grow.set('state', 'off');
                }
            },
            log_do_data: {
                name: 'Disolved Oxygen Sensor', 
                template: 'sensor',
                type: 'D.O.', // Currently needed for visualization component... HACK.
                schedule: 'every 1 second',
                function: function () {
                    // Request a reading
                    board.i2cWrite(0x61, [0x52, 0x00]);
                    // Read response.
                    board.i2cRead(0x61, 14, function (bytes) {
                        // console.log(bytes);
                        var bytelist = [];
                        // if the reading is successful
                        if (bytes[0] === 1) {
                            for (i = 0; i < bytes.length; i++) {
                                if (bytes[i] !== 1 && bytes[i] !== 0) {
                                    bytelist.push(ascii.symbolForDecimal(bytes[i]));
                                }
                            }
                            DO_reading = bytelist.join('');
                        }
                    });

                    // // Send value to Grow-IoT
                    grow.log({
                      type: 'D.O.',
                      value: DO_reading
                    });
                }
            },
            log_ph_data: {
                name: 'pH sensor', 
                template: 'sensor',
                type: 'pH', // Currently needed for visualization component... HACK.
                schedule: 'every 1 second',
                function: function () {
                    // Request a reading
                    board.i2cWrite(0x63, [0x52, 0x00]);
                    // Read response.
                    board.i2cRead(0x63, 7, function (bytes) {
                        var bytelist = [];
                        if (bytes[0] === 1) {
                            for (i = 0; i < bytes.length; i++) {
                                if (bytes[i] !== 1 && bytes[i] !== 0) {
                                    bytelist.push(ascii.symbolForDecimal(bytes[i]));
                                }
                            }
                            pH_reading = bytelist.join('');
                        }
                    });

                    // // Send value to Grow-IoT
                    grow.log({
                      type: 'pH',
                      value: pH_reading
                    });
                }
            }
        }
    });
});
