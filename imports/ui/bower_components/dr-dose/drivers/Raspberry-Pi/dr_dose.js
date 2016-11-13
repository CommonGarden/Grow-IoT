var GrowInstance = require('Grow.js');
var raspio = require('raspi-io');
var five = require('johnny-five');
var ascii = require('ascii-codes');
var Hysteresis = require('hysteresis');

// Create a new board object
var board = new five.Board({
  io: new raspio()
});

// When board emits a 'ready' event run this start function.
board.on('ready', function start() {

    var pH_reading,
        pH_readings = [],
        eC_reading,
    	eC_readings = [],
        acidpump = new five.Pin('P1-11'),
        basepump = new five.Pin('P1-12'),
        nutrientpump = new five.Pin('P1-13');

    // Hack: Relays are inversed... make sure pumps are off.
    // Better hardware could take care of this... I'm not an electrical engineer.
    acidpump.high();
    basepump.high();
    nutrientpump.high();

    // This must be called prior to any I2C reads or writes.
    // See Johnny-Five docs: http://johnny-five.io
    this.i2cConfig();

    // Create a new grow instance and connect to https://grow.commongarden.org
    var grow = new GrowInstance({
        uuid: null,
        token: null,
        name: 'Dr. Dose', // The display name for the thing.
        desription: 'Dr. Dose keeps your pH balanced.',

        // Properties can be updated by the API
        properties: {
            state: null,
            duration: {
                type: Number,
                value: 2000
            }
        },

        // Actions are the API of the thing.
        actions: {
            acid: {
                function: function (duration) {
                    acidpump.low();

                    var duration = Number(grow.get('duration', 'acid'));
                    setTimeout(function () {
                        acidpump.high();
                    }, duration);
                }
            },
            
            base: {
                name: 'Dose base',
                event: 'Dosed base',
                function: function (duration) {
                    basepump.low();

                    var duration = Number(grow.get('duration', 'base'));
                    setTimeout(function () {
                        basepump.high();
                    }, duration);
                }
            },

            nutrient: {
                name: 'Dose nutrient',
                event: 'Dosed base',
                function: function (duration) {
                    // console.log('nutrient: ' + duration);
                    nutrientpump.low();

                    var duration = Number(grow.get('duration', 'nutrient'));
                    setTimeout(function () {
                        nutrientpump.high();
                    }, duration);
                }
            }
        },

        events: {
            ec_data: {
                name: 'Conductivity',
                type: 'ec',
                template: 'sensor',
                min: 400,
                max: 800,
                readings: 20,
                schedule: 'every 7 seconds',
                function: function () {
                    // Request a reading
                    board.i2cWrite(0x64, [0x52, 0x00]);
                    // Read response.
                    board.i2cRead(0x64, 32, function (bytes) {
                        var bytelist = [];
                        if (bytes[0] === 1) {
                            // console.log(bytes);
                            for (i = 0; i < bytes.length; i++) {
                                if (bytes[i] !== 1 && bytes[i] !== 0) {
                                    bytelist.push(ascii.symbolForDecimal(bytes[i]));
                                }
                            }
                            eC_reading = bytelist.join('');
                        }
                    });

                    eC_reading = parseEC(eC_reading);

                    // // Push reading to the list of readings.
                    if (eC_reading) {
                        eC_readings.push(eC_reading);

                        var min = Number(grow.get('min', 'ec_data'));
                        var max = Number(grow.get('max', 'ec_data'));
                        var state = grow.get('state', 'ec_data');
                        var numberOfReadings = Number(grow.get('readings', 'ec_data'));
                        var check = Hysteresis([min,max]);

                        // limit readings in memory to numberOfReadings
                        if (eC_readings.length > numberOfReadings) {
                            eC_readings.shift();
                        }

                        var EC_reading_average = average(eC_readings);

                        // We don't dose unless there are a certain number of readings.
                        if (eC_readings.length > numberOfReadings) {

                            if (EC_reading_average > min && EC_reading_average < max && state !== 'Conductivity good') {
                                grow.emitEvent('Conductivity good')
                                    .set('state', 'Conductivity good');
                            }

                            else if (EC_reading_average < min) {
                                if (state !== 'Conductivity low') {
                                    grow.emitEvent('Conductivity low')
                                        .set('state', 'Conductivity low');
                                }

                                // Dose nutrient
                                grow.call('nutrient');
                            }

                            else if (EC_reading_average > max) {
                                if (state !== 'Conductivity high') {
                                    grow.emitEvent('Conductivity high, add more water.')
                                        .set('state', 'Conductivity high');
                                }
                            }

                            // Reset eC_readings
                            eC_readings = [];
                        }

                        // Send data to the Grow-IoT app.
                        grow.log({
                          type: 'ec',
                          value: 424
                        });
                    // }
                }
            },

            ph_data: {
                name: 'Check pH',
                type: 'pH',
                template: 'sensor',
                min: 6.9,
                max: 7.0,
                readings: 20, // The readings before evaluation.
                schedule: 'every 3 seconds',
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

                    // Filter out non-readings
                    if (ispH(pH_reading)) {
                        pH_readings.push(pH_reading);

                        var min = Number(grow.get('min', 'ph_data'));
                        var max = Number(grow.get('max', 'ph_data'));
                        var state = grow.get('state');
                        var numberOfReadings = Number(grow.get('readings', 'ph_data'));
                        var check = Hysteresis([min,max]);

                        // limit readings in memory to numberOfReadings
                        if (pH_readings.length > numberOfReadings) {
                            pH_readings.shift();
                        }

                        var averageReading = average(pH_readings);

                        // We don't dose unless there are a certain number of readings.
                        if (pH_readings.length >= numberOfReadings) {
                            // console.log('works');
                            // console.log(check(averageReading));

                            if (averageReading > min && averageReading < max && state !== 'pH good') {
                                grow.set('state', 'pH good');
                            }

                            else if (averageReading < min) {
                                if (state !== 'pH low') {
                                    grow.set('state', 'pH low');
                                }

                                // Dose base
                                grow.call('base');
                            }

                            else if (averageReading > max) {
                                if (state !== 'pH high') {
                                    grow.set('state', 'pH high');
                                }

                                // Dose Acid
                                grow.call('acid');
                            }

                            // Reset pH_readings
                            pH_readings = [];
                        }

                        // Send data to the Grow-IoT app.
                        grow.log({
                          type: 'pH',
                          value: 6.4
                        });
                    // }
                }
            }
        }
    });

    grow.connect({
        host: "grow.commongarden.org",
        tlsOpts: {
          tls: {
            servername: "galaxy.meteor.com"
          }
        },
        port: 443,
        ssl: true
    });
});


// Todo: maybe include some of these helper functions in Grow.js
// Returns true if the reading falls in a valid pH range.
// This is to filter out bad readings.
function ispH (reading) {
    // TODO make sure it's a number.
    if (reading > 0 && reading <= 14) {
        return true;
    } else {
        return false;
    }
}

// Parse the Electrical conductivity value from the sensor reading.
function parseEC (reading) {
    if (typeof reading === 'string') {
        return reading.split(',')[0];
    } else {
        return false;
    }
}

function average (listOfReadings) {
    // Here we take the average of the readings
    // This is to prevent overdosing.
    var average = 0;
    for (var i = listOfReadings.length - 1; i >= 0; i--) {
        if (listOfReadings[i] !== undefined && listOfReadings !== 0) {
            average += Number(listOfReadings[i]);
        }
    }

    return average / listOfReadings.length;
}
