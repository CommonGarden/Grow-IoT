// Require the Grow.js build and johnny-five library.
var Thing = require('../../../dist/Grow.umd.js');
var five = require('johnny-five');

// See http://johnny-five.io/ to connect devices besides arduino.
var board = new five.Board();

var emit_and_analyze;

// When board emits a 'ready' event run this start function.
board.on('ready', function start() {
    // Define variables
    var LED = new five.Pin(13),
        lightSensor = new five.Sensor('A1');

    // Create a new thing.
    var light = new Thing({
        uuid: '35b9e367-5a0c-48b8-b11c-4b0b92390632',
        token: 'FJPkgSnv5LmM7JPcQeSvfayo6KWfnRYw',

        component: 'smart-light',

        properties: {
            state: 'off',
            threshold: 300,
            interval: 3000,
            lightconditions: null
        },

        start: function () {
            var interval = this.get('interval');
            
            emit_and_analyze = setInterval(function () {
                light.light_data();
                light.check_light_data();
            }, interval);
        },

        stop: function () {
            clearInterval(emit_and_analyze);
            light.removeAllListeners();
        },

        turn_on: function () {
            LED.high();
            light.set('state', 'on');
            console.log('light on');
        },

        turn_off:  function () {
            LED.low();
            light.set('state', 'off');
            console.log('light off')
        },

        light_data: function () {
            console.log(lightSensor.value);

            light.emit({
              type: 'light',
              value: lightSensor.value
            });
        },

        check_light_data: function () {
            var threshold = light.get('threshold');
            if ((lightSensor.value < threshold) && (light.get('lightconditions') != 'dark')) {
                light.set('lightconditions', 'dark');
                light.call('turn_on');
            } else if ((lightSensor.value >= threshold) && (light.get('lightconditions') != 'light')) {
                light.set('lightconditions', 'light');
                light.call('turn_off');
            }
        }
    });

    light.connect(
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
