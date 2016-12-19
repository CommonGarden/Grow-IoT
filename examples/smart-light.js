// Require the Grow.js build and johnny-five library.
var Thing = require('../dist/Grow.umd.js');

var light_data, emit_and_analyze;

// Create a new thing.
var light = new Thing({
    uuid: '205d24b0-234b-43b9-9c00-f22d97a79488',
    token: '7YvjsSAWRCKpDBDzSR8EbkAx6ur7ztvW',

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
