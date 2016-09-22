/*
# Breath: a disolved oxygen sensor and air pump control system.

# Status: prototype

This example uses the Atlas Scientific dissolved oxygen sensor. See their website for more info.

* [Product page](https://www.atlas-scientific.com/product_pages/kits/do_kit.html)
* [Documentation](http://atlas-scientific.com/_files/_datasheets/_circuit/DO_EZO_Datasheet.pdf)

As for the air pump, we are currently using an aquarium air pump which we control through a relay. If you don't want to cut any wires, you can use: http://www.powerswitchtail.com/Pages/default.aspx

Other suggestions are welcome.
*/

// Require the Grow.js build and johnny-five library.
var GrowInstance = require('../../../dist/Grow.umd.js');
var five = require('johnny-five');
var ascii = require('ascii-codes');
var Hysteresis = require('hysteresis');


// Create a new board object
var board = new five.Board();

// When board emits a 'ready' event run this start function.
board.on('ready', function start() {
    // This must be called prior to any I2C reads or writes.
    this.i2cConfig();

    // Declare variables
    var DO_reading;

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
                    grow.set('state', 'airpump on');
                }
            },
            turn_pump_off: {
                name: 'Airpump off',
                schedule: 'at 8:30pm',
                function: function () {
                    airpump.low();
                    grow.set('state', 'airpump off');
                }
            }
        },
        events: {
        	do_data: {
                name: 'Dissolved Oxygen', 
                template: 'sensor',
                state: null,
                min: 6,
                max: 9,
                type: 'dissolved_oxygen', // Currently needed for visualization component... HACK.
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

                    var min = grow.get('min', 'do_data');
                    var max = grow.get('max', 'do_data');
                    var state = grow.get('state', 'do_data');
                    if (DO_reading < min && state !== 'low') {
                        grow.emitEvent('Disolved oxygen low')
                            .set('state', 'low', 'do_data')
                            .call('turn_pump_on');
                    } else if (DO_reading > max && state !== 'high') {
                        grow.emitEvent('Disolved oxygen high')
                            .set('state', 'high', 'do_data')
                            .call('turn_pump_off');
                    } else if (DO_reading > min && DO_reading < max && state !== null) {
                        grow.emitEvent('Disolved oxygen good')
                            .set('state', null, 'do_data');
                    }

                    // Send value to Grow-IoT
                    grow.log({
                      type: 'dissolved_oxygen',
                      value: DO_reading
                    });
                }
            }
        }
    });
});
