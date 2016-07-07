// Import the grow.js library.
var GrowInstance = require('../../../dist/Grow.umd.js');

var five = require('johnny-five');
var ascii = require('ascii-codes');

// Create a new board object
var board = new five.Board();

// When board emits a 'ready' event run this start function.
board.on('ready', function start() {
    // Declare variables and pins
    var pH_reading;
    var pH_readings = [];
    var circpump = new five.Pin(10);
    var acidpump = new five.Pin(11);
    var basepump = new five.Pin(12);

    // This must be called prior to any I2C reads or writes.
    // See Johnny-Five docs: http://johnny-five.io
    this.i2cConfig();

    // Create a new grow instance. Connects by default to localhost:3000
    // Create a new grow instance.
    var grow = new GrowInstance({
        name: 'Dr. Dose', // The display name for the thing.
        desription: 'Dr. Dose keeps your pH balanced.',

        // The username of the account you want this device to be added to.
        username: 'jake2@gmail.com',

        // Properties can be updated by the API
        properties: {
            state: null
        },

        // Actions are the API of the thing.
        actions: {
            acid: {
                name: 'Dose acid', // Display name for the action
                duration: 2000,
                disable: false,
                event: 'Dosed acid for 2 seconds',
                function: function () {
                    acidpump.high();

                    var duration = grow.get('duration', 'base');
                    setTimeout(function () {
                        acidpump.low();
                    }, duration)

                    // Circulate water
                    grow.call('circulate');

                    // Disable acid pump
                    grow.set('disable', true, 'acid');

                    // Disable for 20s to allow water to cirulate.
                    var circulateWaterDuration = grow.get('duration', 'cirulate');
                    setTimeout(function () {
                        grow.set('disable', false, 'acid');
                    }, circulateWaterDuration);
                }

            },
            base: {
                name: 'Dose base',
                duration: 2000,
                disable: false,
                event: 'Dosed base for 2 seconds',
                function: function () {
                    basepump.high();

                    var duration = grow.get('duration', 'base');
                    setTimeout(function () {
                        basepump.low();
                    }, duration)

                    // Circulate water
                    grow.call('circulate');

                    // Disable base pump.
                    grow.set('disable', true, 'base');

                    // Disable for 20s to allow water to cirulate.
                    var circulateWaterDuration = grow.get('duration', 'cirulate');
                    setTimeout(function () {
                        grow.set('disable', false, 'base');
                    }, circulateWaterDuration);
                }
            },
            circulate: {
                name: 'Circulate',
                duration: 20000,
                event: 'Circulate water for 20s.',
                function: function () {
                    circpump.high();

                    var duration = grow.get('duration', 'circulate');
                    setTimeout(function () {
                        circpump.low();
                    }, duration);
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
                        }
                    });

                    // Send data to the Grow-IoT app.
                    grow.log({
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
                min: 5,
                max: 7,
                function: function () {
                    var min = grow.get('min', 'check_ph');
                    var max = grow.get('max', 'check_ph');
                    var state = grow.get('state', 'check_ph');

                    pH_readings.push(pH_reading);

                    // limit readings in memory to 100
                    if (pH_readings.length > 100) {
                        pH_readings.shift();
                    }

                    var average = 0;

                    for (var i = pH_readings.length - 1; i >= 0; i--) {
                        average += pH_readings[i];
                    }

                    average = average / pH_readings.length;
                    // Collect 50 readings before evaluating pH
                    if (pH_readings.length > 50) {
                        if (average < min && state !== 'low') {
                            grow.emitEvent('pH low')
                                .set('state', 'low', 'check_ph')
                                .set('state', 'low')
                                .call('base');
                        } else if (average > max && state !== 'high') {
                            grow.emitEvent('pH high')
                                .set('state', 'high', 'check_ph')
                                .set('state', 'high')
                                .call('acid');
                        } else if (average > min && average < max && state !== null) {
                            grow.emitEvent('pH good')
                                .set('state', null)
                                .set('state', null, 'check_ph');
                        }
                    }
                }
            }
        }
    });
});

