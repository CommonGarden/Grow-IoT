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
        lightSensor = new five.Sensor('A0');

    // Create a new thing.
    var light = new Thing({
        uuid: '8be2d928-326e-4aaa-a545-49efcf2d3dd8',
        token: 'woiWKNXv9Bo8JerYvshjkRTRutiRD9xf',

        component: 'smart-light',

        properties: {
            state: 'off',
            threshold: 300,
            interval: 1000,
            lightconditions: null
        },

        start: function () {
            var interval = this.get('interval');
            
            emit_and_analyze = setInterval(function () {
                light.call('light_data');
                light.call('check_light_data');
            }, interval);

            // Todo: implement clear interval function so we can adjust
            // the rate at which data is logged.
        },

        stop: function () {
            clearInterval(emit_and_analyze);
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
            } else if ((lightSensor.value >= threshold) && (light.get('lightconditions') != 'light')) {
                light.set('lightconditions', 'light');
            }
        }
    });

    light.connect();
});
