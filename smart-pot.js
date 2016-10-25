// Require the Grow.js build and johnny-five library.
var GrowBot = require('./dist/Grow.umd.js');
var five = require('johnny-five');

var raspio = require('raspi-io');

// Create a new board object
var board = new five.Board({
  io: new raspio()
});


// When board emits a 'ready' event run this start function.
board.on('ready', function start() {
    var waterpump = new five.Relay('P1-11');
    var light = new five.Relay('P1-12');

    // Create a new grow instance.
    var smartpot = new GrowBot({
        uuid: 'a35c8a73-21b7-4efd-a479-6309c2aeb8be',
        token: 'TqcTcvJGMXwecHfRknbTDEK2XNiSvHmh',
        webcomponent: 'smart-pot',
        smartPot: true, // Hack.
        name: 'Smartpot and light controller!', // The display name for the thing.
        desription: 'Two things merged into one.',
        properties: {
            state: 'off',
            lightconditions: null
        },

        turn_light_on: function () {
            light.open();
            console.log('light on');
        },

        turn_light_off: function () {
            light.close();
            console.log('light off');
        },

        water_plant: function (duration) {
            console.log('Watering plant');
            // If duration is not defined, get the document default.
            waterpump.open();
            // TODO: test if this works
            smartpot.schedule(function () {
                waterpump.close();
            }, duration);
        }
    });

    smartpot.connect({
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
