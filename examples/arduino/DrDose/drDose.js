// Require the Grow.js build and johnny-five library.
var GrowInstance = require('../../../dist/Grow.umd.js');
var five = require('johnny-five');
var ascii = require('ascii-codes');

// Create a new board object
var board = new five.Board();

// When board emits a 'ready' event run this start function.
board.on('ready', function start() {
    // Declare variables for sensor readings
    var pH_reading;

    // This must be called prior to any I2C reads or writes.
    // See Johnny-Five docs: http://johnny-five.io
    this.i2cConfig();

    // Create a new grow instance. Connects by default to localhost:3000
    // Create a new grow instance.
    var grow = new GrowInstance({
        name: 'Dr. Dose', // The display name for the thing.
        desription: 'Let Dr. Dose manage your hydroponic water resevoir. It keeps your pH balanced and nutrients at optimal levels.',

        // The username of the account you want this device to be added to.
        username: 'jake2@gmail.com',

        // Actions are the API of the thing.
        actions: {
            acid: {
                name: 'Dose acid', // Display name for the action
                options: {
    			   duration: 2000
                },
                function: function () {
                	// Todo: dosing function
                	return;
                }

            },
            base: {
                name: 'Dose base',
                options: {
    			   duration: 2000
                },
                function: function () {
                	// Todo: dosing function
                	return;
                }
            },
            ph_data: {
                name: 'Log ph data',
                type: 'pH',
                template: 'sensor',
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
                            // console.log(pH_reading);
                        }
                    });

                    console.log(pH_reading);
                    // // Send value to Grow-IoT
                    grow.sendData({
                      type: 'pH',
                      value: pH_reading
                    });
                }
            }
        },
        events: {
            check_ph: {
                name: 'Check pH',
                on: 'ph_data',
                state: null,
                options: {
                    min: 6.1,
                    max: 6.5
                },
                function: function () {
                    // var opts = grow.thing.getProperty('options', 'check_ph');
                    // console.log(opts);
                    // if (currentpHValue < opts.min && state !== 'low') {
                    //     grow.emitEvent('pH low');
                    //     grow.setProperty('state', 'check_ph', 'low')
                    // } else if (currentpHValue > opts.max && state !== 'low') {
                    //     grow.emitEvent('pH high');
                    //     grow.setProperty('state', 'check_ph', 'low')
                    // } else if (currentpHValue > opts.min && currentpHValue < opts.max) {
                    //     grow.setProperty('state', 'check_ph', null)
                    // }
                }
            }
        }
    });
});
