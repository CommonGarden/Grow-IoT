// Require the Grow.js build and johnny-five library.
var GrowBot = require('Grow.js');
var five = require('johnny-five');
// var Chip = require('chip-io');

// // Create a new board object
var board = new five.Board();

// When board emits a 'ready' event run this start function.
board.on('ready', function start() {
    // Define variables
    var light = new five.Relay(13);
    var waterpump = new five.Relay(12);

    waterpump.close();

    // Create a new grow instance.
    var smartpot = new GrowBot({
        uuid: '4f85fc92-1586-4dcf-bb9f-1066f958d386',
        token: 'PTvyf7AzsJAkJ4jvfLvZip6qJGJQLSZY',
        webcomponent: 'smart-pot',
        smartPot: true, // Hack.
        properties: {
            state: 'off',
            lightconditions: null
        },

        turn_light_on: function () {
            light.open();
            // smartpot.set('state', 'on');
        },

        turn_light_off: function () {
            light.close();
            // smartpot.set('state', 'off');
        },
        water_plant: function (duration) {
            console.log('Watering plant: ' + duration);
            // If duration is not defined, get the document default.
            waterpump.open();
            // TODO: test if this works
            setTimeout(function () {
                waterpump.close();
            }, 10000);
        }
    });

    smartpot.connect(
    {
        host: "grow.commongarden.org",
        tlsOpts: {
          tls: {
            servername: "galaxy.meteor.com"
          }
        },
        port: 443,
        ssl: true
    }
    );
});
