// Require the Grow.js build and johnny-five library.
var Thing = require('../dist/Grow.umd.js');

var light_data;

var light = new Thing({
    uuid: '38d7d310-ede4-48e9-88fc-fcf1d9a2fbf7',
    token: 'wZpSadperac8dTGKTgcpsq37aBAk25XA',

    component: 'smart-light',

    properties: {
        state: 'off',
        threshold: 300,
        interval: 2000,
        lightconditions: null
    },

    start: function () {        
        setInterval(function emit_and_analyze() {
            light.call('light_data');
            light.call('check_light_data');
        }, light.get('interval'));
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
        light_data = Math.random() * 1000;
        console.log(light_data);

        light.emit({
          type: 'light',
          value: light_data
        });
    },

    check_light_data: function () {
        var threshold = light.get('threshold');
        if ((light_data < threshold) && (light.get('lightconditions') != 'dark')) {
            light.set('lightconditions', 'dark');
        } else if ((light_data >= threshold) && (light.get('lightconditions') != 'light')) {
            light.set('lightconditions', 'light');
        }
    }
});

light.connect();
