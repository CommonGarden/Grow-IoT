var GrowInstance = require('Grow.js');
var raspio = require('raspi-io');
var five = require('johnny-five');
var ascii = require('ascii-codes');
var Hysteresis = require('hysteresis');

// Create a new board object
var board = new five.Board({
  io: new raspio()
});

try {
    // When board emits a 'ready' event run this start function.
    board.on('ready', function start() {
        // Declare variables and pins
        var pH_reading,
            pH_readings = [],
            acidpump = new five.Pin('P1-11'),
            basepump = new five.Pin('P1-12');

        // Hack: Relays are inversed... make sure pumps are off.
        // Better hardware could take care of this... I'm not an electrical engineer.
        acidpump.high();
        basepump.high();

        // This must be called prior to any I2C reads or writes.
        // See Johnny-Five docs: http://johnny-five.io
        this.i2cConfig();

        // Create a new grow instance and connect to https://grow.commongarden.org
        var grow = new GrowInstance({
            host: "grow.commongarden.org",
            tlsOpts: {
                tls: {
                    servername: "galaxy.meteor.com"
                }
            },
            port: 443,
            ssl: true,
            name: 'Dr. Dose', // The display name for the thing.
            desription: 'Dr. Dose keeps your pH balanced.',

            // The username of the account you want this device to be added to.
            username: 'jake.hartnell@gmail.com',

            // Properties can be updated by the API
            properties: {
                state: null
            },

            // Actions are the API of the thing.
            actions: {
                acid: {
                    name: 'Dose acid', // Display name for the action
                    duration: 2000,
                    event: 'Dosed acid',
                    function: function () {
                        acidpump.low();

                        var duration = Number(grow.get('duration', 'acid'));
                        setTimeout(function () {
                            acidpump.high();
                        }, duration);
                    }
                },
                
                base: {
                    name: 'Dose base',
                    duration: 2000,
                    event: 'Dosed base',
                    function: function () {
                        basepump.low();

                        var duration = Number(grow.get('duration', 'base'));
                        setTimeout(function () {
                            basepump.high();
                        }, duration);
                    }
                }
            },

            events: {
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
                            // // Push reading to the list of readings.
                            console.log(pH_reading);
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

                            // Here we take the average of the readings
                            // This is to prevent overdosing.
                            var averageReading = average(pH_readings);

                            console.log(averageReading);
                            console.log(pH_readings.length);

                            // We don't dose unless there are a certain number of readings.
                            if (pH_readings.length >= numberOfReadings) {
                                console.log('works');
                                console.log(check(averageReading));

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
                              value: pH_reading
                            });
                        }
                    }
                }
            }
        });
    });
} catch (err) {
    console.log(err);
}

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
