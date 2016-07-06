// Import the grow.js library.
var GrowInstance = require('../../../dist/Grow.umd.js');
var five = require('johnny-five');
var ascii = require('ascii-codes');

// Create a new board object
var board = new five.Board();

// When board emits a 'ready' event run this start function.
board.on('ready', function start() {
    // Declare variables for sensor readings
    var pH_reading,
        DO_reading;

    var pH_readings = [];

    var conductivity = new five.Sensor('A0');
    var temperature = new five.Sensor('A1');
    var lights = new five.Pin(11);
    var heater = new five.Pin(12);
    // var airpump = new five.Pin(13);
    var basepump = new five.Pin(13);

    // This must be called prior to any I2C reads or writes.
    // See Johnny-Five docs: http://johnny-five.io
    this.i2cConfig();

    // Create a new grow instance. Connects by default to localhost:3000
    // Create a new grow instance.
    var grow = new GrowInstance({
        name: 'Environment Computer V1', // The display name for the thing.

        // The username of the account you want this device to be added to.
        username: 'jake2@gmail.com',

        // Actions are the API of the thing.
        actions: {
            acid: {
                name: 'Dose acid', // Display name for the action
                duration: 2000,
                disable: false,
                event: 'Dosed acid for 2 seconds',
                function: function () {
                    // Todo: dosing function
                    console.log('Acid');

                    grow.call('circulate');

                    grow.set('disable', true, 'acid');

                    // Disable for 20s to allow water to cirulate.
                    var duration = grow.get('duration', 'circulate');
                    setTimeout(function () {
                        grow.set('disable', false, 'acid');
                    }, duration);
                }
            },

            turn_light_on: {
                name: '',
                duration: 2000,
                disable: false,
                event: 'Dosed base for 2 seconds',
                function: function () {
                    // Todo: dosing function
                    console.log('Base');

                    basepump.high();


                    var duration = grow.get('duration', 'base');
                    setTimeout(function () {
                        basepump.low();
                    }, duration)

                    grow.call('circulate');

                    grow.set('disable', true, 'base');

                    // Disable for 20s to allow water to cirulate.
                    var circulateduration = grow.get('duration', 'circulate');
                    setTimeout(function () {
                        grow.set('disable', false, 'base');
                    }, circulateduration);
                }
            },

            nutrient: {
                name: 'Dose nutrient',
                duration: 2000,
                disable: false, // todo: reflect disabled state in Grow-IoT UI.
                event: 'Dosed nutrient for 2 seconds',
                function: function () {
                    // Todo: dosing function
                    console.log('Nutrient');

                    grow.call('circulate');

                    grow.set('disable', true, 'nutrient');

                    // Disable for 20s to allow water to cirulate.
                    var duration = grow.get('duration', 'circulate');
                    setTimeout(function () {
                        grow.set('disable', false, 'nutrient');
                    }, duration);
                }
            },

            circulate: {
                name: 'Circulate',
                duration: 20000,
                event: 'Circulate water',
                function: function () {
                    // Todo: dosing function
                    console.log('Circulate');
                }
            },

            turn_pump_on: {
                name: 'Airpump On', // Display name for the action
                description: 'Turns the pump on.', // Optional description
                schedule: 'at 9:00am', // Optional scheduling using later.js
                event: 'Airpump on',
                function: function () {
                    // The implementation of the action.
                    airpump.high();
                }
            },

            turn_pump_off: {
                name: 'Airpump off',
                schedule: 'at 8:30pm',
                event: 'Airpump off',
                function: function () {
                    airpump.low();
                }
            },

            turn_heater_on: {
                name: 'Heater on',
                function: function () {
                    heater.high();
                }
            },

            turn_heater_off: {
                name: 'Heater off',
                function: function () {
                    heater.low();
                }
            },

            turn_lights_on: {
                name: 'Lights on',
                function: function () {
                    lights.high();
                }
            },

            turn_lights_off: {
                name: 'Lights off',
                function: function () {
                    lights.low();
                }
            },

            temp_data: {
                name: 'Temperature',
                type: 'temperature',
                template: 'sensor',
                schedule: 'every 1 second',
                function: function () {
                    grow.log({
                        type: 'temperature',
                        value: Math.round(temperature.value)
                    });
                }
            },

            ec_data: {
                name: 'Electrical conductivity',
                type: 'eC',
                template: 'sensor',
                schedule: 'every 1 second',
                function: function () {
                    // Calibrated with a shitty analog sensor. Not very precise.
                    grow.log({
                        type: 'eC',
                        value: Math.round(conductivity.value * 0.2)
                    });
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
            },

            light_data: {
                name: 'Photo resistor',
                template: 'sensor',
                type: 'light',
                schedule: 'every 1 second',
                function: function () {
                    return;
                }
            },

            do_data: {
                name: 'Disolved Oxygen Sensor', 
                template: 'sensor',
                type: 'disolved_oxygen', // Currently needed for visualization component... HACK.
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
                      type: 'disolved_oxygen',
                      value: DO_reading
                    });
                }
            }
        },

        events: {
            check_temp: {
                name: 'Check temperature',
                on: 'temp_data',
                state: null,
                min: 18,
                max: 25, // Celcius
                function: function () {
                    var min = grow.get('min', 'check_temp');
                    var max = grow.get('max', 'check_temp');
                    var state = grow.get('state', 'check_temp');
                    if (pH_reading < min && state !== 'low') {
                        grow.emitEvent('Temperature low')
                            .set('state', 'low', 'check_temp');
                    } else if (pH_reading > max && state !== 'high') {
                        grow.emitEvent('Temperature high')
                            .set('state', 'high', 'check_temp');
                    } else if (pH_reading > min && pH_reading < max) {
                        grow.emitEvent('Temperature good')
                            .set('state', null, 'check_temp');
                    }
                }
            },

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
                                .call('base');
                        } else if (average > max && state !== 'high') {
                            grow.emitEvent('pH high')
                                .set('state', 'high', 'check_ph')
                                .call('acid');
                        } else if (average > min && average < max && state !== null) {
                            grow.emitEvent('pH good')
                                .set('state', null, 'check_ph');
                        }
                    }
                }
            },

            check_DO: {
                name: 'Check disolved oxygen',
                on: 'do_data',
                state: null,
                min: 5.5,
                max: 8,
                function: function () {
                    var min = grow.get('min', 'check_DO');
                    var max = grow.get('max', 'check_DO');
                    var state = grow.get('state', 'check_DO');
                    if (DO_reading < min && state !== 'low') {
                        grow.emitEvent('Disolved oxygen low')
                            .set('state', 'low', 'check_DO');
                            // .call('turn_pump_on');
                    } else if (DO_reading > max && state !== 'high') {
                        grow.emitEvent('Disolved oxygen high')
                            .set('state', 'high', 'check_DO');
                            // .call('turn_pump_off');
                    } else if (DO_reading > min && DO_reading < max && state !== null) {
                        grow.emitEvent('Disolved oxygen good')
                            .set('state', null, 'check_DO');
                    }
                }
            },

            check_ec: {
                name: "Check conductivity",
                on: "ec_data",
                state: null,
                min: 300,
                max: 700,
                function: function () {
                    var min = grow.get('min', 'check_ec');
                    var max = grow.get('max', 'check_ec');
                    var state = grow.get('state', 'check_ec');
                    if (conductivity.value < min && state !== 'low') {
                        grow.emitEvent('Nutrients low')
                            .set('state', 'low', 'check_ec');
                    } else if (conductivity.value > max && state !== 'high') {
                        grow.emitEvent('Nutrients high')
                            .set('state', 'high', 'check_ec');
                    } else if (conductivity.value > min && conductivity.value < max && state !== null) {
                        grow.emitEvent('Nutrients good')
                            .set('state', null, 'check_ec');
                    }
                }
            }
        }
    });
});

