// Require the Grow.js build and johnny-five library.
var GrowInstance = require('../../../dist/Grow.umd.js');
var five = require('johnny-five');

// See http://johnny-five.io/ to connect devices besides arduino.
var board = new five.Board();

// When board emits a 'ready' event run this start function.
board.on('ready', function start() {
    // Define variables
    var LED = new five.Pin(13),
        lightSensor = new five.Sensor('A0');

    // Hack because my board is broken.
    lightSensorPower.high();

    // Create a new grow instance.
    var grow = new GrowInstance({
        uuid: '',
        token: '',
        properties: {
            state: 'off',
            threshold: 300,
            interval: 1000,
            lightconditions: null
        },

        start: function () {
            var interval = grow.get('interval');
            
            setInterval(function log_and_analyze(argument) {
                grow.call('light_data');
                grow.call('check_light_data');
            }, interval);

            // Todo: implement clear interval function so we can adjust
            // the rate at which data is logged.
        },

        turn_light_on: function () {
            // The implementation of the action.
            LED.high();
            grow.set('state', 'on');
            console.log('light on');

        },

        turn_light_off:  function () {
            LED.low();
            grow.set('state', 'off');
            console.log('light off')
        },

        light_data: function () {
            console.log(lightSensor.value);
            grow.log({
              type: 'light',
              value: lightSensor.value
            });
        },

        check_light_data: function () {
            var threshold = grow.get('threshold');
            if ((lightSensor.value < threshold) && (grow.get('lightconditions') != 'dark')) {
                // This could be nice with a chaining API...
                // It would be good if we could add additional rules with the environment.
                // EventListeners
                grow.emit('dark');
                grow.set('lightconditions', 'dark');
            } else if ((lightSensor.value >= threshold) && (grow.get('lightconditions') != 'light')) {
                // This could be nice with a chaining API...
                grow.emit('light');
                grow.set('lightconditions', 'light');
            }
        }
    });
});
