var GrowInstance = require('Grow.js');
var ascii = require('ascii-codes');
var http = require('http');
var url = require('url');
var raspio = require('raspi-io');
var five = require('johnny-five');
var later = require('later');
var Hs100Api = require('hs100-api');
var growfile = require('./growfile');
var heater = require('./heater');
var light = require('./light');
var _ = require('underscore');


// Use local time, not UTC.
later.date.localTime();

// Create a new board object
var board = new five.Board({
  io: new raspio()
});

// When board emits a 'ready' event run this start function.
board.on('ready', function start() {
    // Declare needed variable.
    var pH_reading,
        eC_reading,
        emit_and_analyze,
        light_on_timer,
        light_off_timer;

    // Create a new growHub instance and connect to https://growHub.commongarden.org
    var growHub = new GrowInstance({
        uuid: 'bfeffe4c-b78c-4f3f-9c5e-827684ea96da',
        token: 'xsG6G5PyQMKPycWN5AjZvuSD2K4GmMcn',
        component: 'grow-hub',

        // Properties can be updated by the API
        properties: {
            state: null,
            duration: 2000,
            interval: 5000,
            targets: {},
        },

        light: new five.Light({
          controller: "TSL2561"
        }),

        multi: new five.Multi({
          controller: "SI7020"
        }),

        start: function () {
            console.log('Grow-Hub initialized.');

            // This must be called prior to any I2C reads or writes.
            // See Johnny-Five docs: http://johnny-five.io
            board.i2cConfig();

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

            var interval = this.get('interval');
            
            emit_and_analyze = setInterval(()=> {
                this.temp_data();
                this.hum_data();
                this.ph_data();
                this.ec_data();
            }, interval);

            this.light.on("change", function() {
              console.log("Ambient Light Level: ", this.level);
            });


            this.parseCycles(growfile.properties.cycles);
        },

        stop: function () {
            console.log("Grow-Hub stopped.");
            clearInterval(emit_and_analyze);
            clearInterval(light_on_timer);
            clearInterval(light_off_timer);
            // TODO: remove all listeners
        },

        // Move to grow.js?
        parseCycles: function(cycles) {
            _.each(cycles, (list, iteratee)=> {
                var scheduledTime = later.parse.text(String(cycles[iteratee].start));
                return later.setTimeout(()=> {
                    try {
                        if (cycles[iteratee].targets) {
                            this.set('targets', cycles[iteratee].targets);
                        }

                        if(cycles[iteratee].options) {
                            this.call(iteratee, cycles[iteratee].options);
                        } else {
                            console.log(iteratee);
                            this.call(iteratee);
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }, scheduledTime);
            });
        },
        
        day: function () {
            console.log('It is day!');
            console.log(this.get('targets'))
            light.call('turn_on');
        },

        night: function () {
            console.log('It is night!');
            console.log(this.get('targets'))
            light.call('turn_off');
        },

        ec_data: function () {
            // Request a reading, 
            board.i2cWrite(0x64, [0x52, 0x00]);

            eC_reading = parseEC(eC_reading);

            if (eC_reading) {
                growHub.emit({
                    type: 'ec',
                    value: eC_reading
                });

                console.log('Conductivity: ' + eC_reading);
            }
        },

        ph_data: function () {
            // Request a reading
            board.i2cWrite(0x63, [0x52, 0x00]);

            if (ispH(pH_reading)) {
                growHub.emit({
                    type: 'ph',
                    value: pH_reading
                });

                console.log('ph: ' + pH_reading);
            }      
        },

        temp_data: function () {
            var heaterState = heater.get('state');
            var targets = this.get('targets');
            var currentTemp = this.multi.thermometer.celsius;

            console.log('Current temp: ' + currentTemp);

            // One could also implement this with a PID controller.
            if (currentTemp < targets.temperature) {
                // Turn on heater if it isn't already
                if (heaterState === 'off') {
                    heater.call('turn_on');
                }
            } else {
                // Turn off heater if it isn't already.
                if (heaterState === 'on') {
                    heater.call('turn_off');
                }
            }
        },

        hum_data: function () {
            console.log("Humidity: " + this.multi.hygrometer.relativeHumidity);
        }
    });

    // Default is localhost: 3000
    // growHub.connect({
    //     host: "grow.commongarden.org",
    //     tlsOpts: {
    //       tls: {
    //         servername: "galaxy.meteor.com"
    //       }
    //     },
    //     port: 443,
    //     ssl: true
    // });
});


// Todo: maybe include some of these helper functions in Grow.js
// Returns true if the reading falls in a valid pH range.
// This is to filter out bad readings.
function ispH (reading) {
    if (reading === undefined) {
        return false;
    }

    else if (reading > 0 && reading <= 14) {
        return true;
    } 

    else {
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
