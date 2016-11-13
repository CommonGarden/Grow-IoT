const GrowInstance = require('Grow.js');
const ascii = require('ascii-codes');
const http = require('http');
const url = require('url');

// Create a new theDr instance and connect to https://theDr.commongarden.org
var theDr = new GrowInstance({
    uuid: 'b71fd42c-3159-44a1-9218-54a5077b37b4',
    token: 'r6h4mth7KFznKLp7xjsyfMooynvyeWdc',
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
        console.log('acid');
        // acidpump.low();

        // // var duration = Number(theDr.get('duration'));
        // setTimeout(function () {
        //     acidpump.high();
        // }, duration);
    },
        
    base: function (duration) {
        console.log('base');
        // basepump.low();

        // // var duration = Number(theDr.get('duration', 'base'));
        // setTimeout(function () {
        //     basepump.high();
        // }, duration);
    },

    nutrient: function (duration) {
        console.log('nutrient');
        // nutrientpump.low();

        // // var duration = Number(theDr.get('duration', 'nutrient'));
        // setTimeout(function () {
        //     nutrientpump.high();
        // }, duration);
    },

    ec_data: function () {
        // // Request a reading
        // board.i2cWrite(0x64, [0x52, 0x00]);
        // // Read response.
        // board.i2cRead(0x64, 32, function (bytes) {
        //     var bytelist = [];
        //     if (bytes[0] === 1) {
        //         // console.log(bytes);
        //         for (i = 0; i < bytes.length; i++) {
        //             if (bytes[i] !== 1 && bytes[i] !== 0) {
        //                 bytelist.push(ascii.symbolForDecimal(bytes[i]));
        //             }
        //         }
        //         eC_reading = bytelist.join('');
        //     }
        // });

        // eC_reading = parseEC(eC_reading);

        theDr.emit({
            type: 'ec',
            value: Math.random()
        });
    },

    ph_data: function () {
        // // Request a reading
        // board.i2cWrite(0x63, [0x52, 0x00]);

        // // Read response.
        // board.i2cRead(0x63, 7, function (bytes) {
        //     var bytelist = [];
        //     if (bytes[0] === 1) {
        //         for (i = 0; i < bytes.length; i++) {
        //             if (bytes[i] !== 1 && bytes[i] !== 0) {
        //                 bytelist.push(ascii.symbolForDecimal(bytes[i]));
        //             }
        //         }
        //         pH_reading = bytelist.join('');
        //     }
        // });

        theDr.emit({
            type: 'ph',
            value: Math.random()
        });         
    }
});

// Default is localhost: 3000
theDr.connect({
    // host: "grow.commongarden.org",
    // tlsOpts: {
    //   tls: {
    //     servername: "galaxy.meteor.com"
    //   }
    // },
    // port: 443,
    // ssl: true
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
