const GrowInstance = require('Grow.js');
const ascii = require('ascii-codes');
const http = require('http');
const url = require('url');
const raspio = require('raspi-io');
const five = require('johnny-five');

// Create a new board object
var board = new five.Board({
  io: new raspio()
});

// When board emits a 'ready' event run this start function.
board.on('ready', function start() {
    var pH_reading,
        pH_readings = [],
        eC_reading,
        eC_readings = [];
       var acidpump = new five.Pin('P1-11'),
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

    // Create a new theDr instance and connect to https://theDr.commongarden.org
    var theDr = new GrowInstance({
        uuid: '9b1e4fe7-f006-4548-9750-72e0c366e27e',
        token: 'yu3PZGW2kozj7M9Hrjnm9XZnGpW9yXiy',
        webcomponent: 'dr-dose',
        drDose: true, // hack
        name: 'Dr. Dose', // The display name for the thing.
        desription: 'Dr. Dose keeps your pH balanced.',

        // Properties can be updated by the API
        properties: {
            state: null,
            duration: 2000,
            ec_data_rate: 'every one second',
            ph_data_rate: 'every one second'
        },

        start: function () {
            console.log('Dr. Dose initialized.');
            // Todo: clear interval
            setInterval(function() {
                theDr.call('ph_data');
            }, 5000);

            setInterval(function() {
                theDr.call('ec_data');
            }, 5000);
        },

        acid: function (duration) {
            acidpump.low();

            // var duration = Number(theDr.get('duration'));
            setTimeout(function () {
                acidpump.high();
            }, duration);
        },
            
        base: function (duration) {
            basepump.low();

            // var duration = Number(theDr.get('duration', 'base'));
            setTimeout(function () {
                basepump.high();
            }, duration);
        },

        nutrient: function (duration) {
            nutrientpump.low();

            // var duration = Number(theDr.get('duration', 'nutrient'));
            setTimeout(function () {
                nutrientpump.high();
            }, duration);
        },

        ec_data: function () {
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

            theDr.emit({
                type: 'ec',
                value: eC_reading
            });
        },

        ph_data: function () {
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

            theDr.emit({
                type: 'ph',
                value: pH_reading
            });         
        }
    });

    // Default is localhost: 3000
    theDr.connect({
        host: "grow.commongarden.org",
        tlsOpts: {
          tls: {
            servername: "galaxy.meteor.com"
          }
        },
        port: 443,
        ssl: true
    });

    // HTTP server for terraswarm demo.
    var server = http.createServer(function(request, response) {
        var urlParts = url.parse(request.url, true);
        var acidRegex = /acid/;
        var baseRegex = /base/;
        var nutrientRegex = /nutrient/;
        var pH_regex = /ph/;
        var ec_regex = /ec/;

        if (urlParts.pathname.match(acidRegex)) {
            theDr.call('acid', Number(urlParts.query.duration));
            response.writeHead(200, {"Content-Type": "application/json"});
            response.end(JSON.stringify({ok: true}));
        }

        else if (urlParts.pathname.match(baseRegex)) {
            theDr.call('base', Number(urlParts.query.duration));
            response.writeHead(200, {"Content-Type": "application/json"});
            response.end(JSON.stringify({ok: true}));
        }

        else if (urlParts.pathname.match(nutrientRegex)) {
            theDr.call('nutrient', Number(urlParts.query.duration));
            response.writeHead(200, {"Content-Type": "application/json"});
            response.end(JSON.stringify({ok: true}));
        }

        else if (urlParts.pathname.match(pH_regex)) {
            theDr.call('ph_data');
            response.writeHead(200, {"Content-Type": "application/json"});
            response.end(JSON.stringify({
                type: 'ph',
                value: pH_reading
            }));
        }

        else if (urlParts.pathname.match(ec_regex)) {
            theDr.call('ec_data');
            response.writeHead(200, {"Content-Type": "application/json"});
            response.end(JSON.stringify({
                type: 'ec',
                value: eC_reading
            }));
        }

        else {
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.end();
        }
    });

    server.listen(8080);
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
