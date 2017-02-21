// Require the Grow.js build and johnny-five library.
var Thing = require('../dist/Grow.umd.js');

var lux, emit_and_analyze;

// Create a new thing.
var light = new Thing({
    uuid: '3d728d07-a3c0-4039-9f73-8009e5216145',
    token: 'LonTWSW8pGB9Ziks6Wcfygc2pXsuYWu3',

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
            light.light_data();
            light.check_light_data();
        }, interval);
    },

    stop: function () {
        clearInterval(emit_and_analyze);
        this.removeAllListeners();
    },

    turn_on: function () {
        light.set('state', 'on');
        console.log('light on');
    },

    turn_off:  function () {
        light.set('state', 'off');
        console.log('light off')
    },

    light_data: function () {
        lux = Math.random() * 10; 

        light.emit({
          type: 'light',
          value: lux
        });
    },

    check_light_data: function () {
        var threshold = light.get('threshold');
        if ((lux < threshold) && (light.get('lightconditions') != 'dark')) {
            light.set('lightconditions', 'dark');
        } else if ((lux >= threshold) && (light.get('lightconditions') != 'light')) {
            light.set('lightconditions', 'light');
        }
    }
});

light.connect();
