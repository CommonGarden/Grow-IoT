// Require the Grow.js build and johnny-five library.
const Thing = require('../dist/Grow.umd.js');
const Controller = require('node-pid-controller');

var temp_data, emit_and_analyze;

// Create a new thing.
var thermostat = new Thing({
    uuid: '205d24b0-234b-43b9-9c00-f22d97a79488',
    token: '7YvjsSAWRCKpDBDzSR8EbkAx6ur7ztvW',

    component: 'temp-controller',

    properties: {
        state: null,
        threshold: 1,
        interval: 1000,
        target: 20
    },

    start: function () {
        let interval = this.get('interval');
        let target = this.get('target');
        
        emit_and_analyze = setInterval(function () {
            thermostat.call('temp_data');
            thermostat.call('check_temp_data');
        }, interval);

        this.ctr = new Controller({
          k_p: 0.25,
          k_i: 0.01,
          k_d: 0.01,
          dt: 1
        });

        this.ctr.setTarget(target);
    },

    stop: function () {
        clearInterval(emit_and_analyze);
    },

    turn_heater_on: function () {
        thermostat.set('state', 'on');
        console.log('heater on');
    },

    turn_heater_off:  function () {
        thermostat.set('state', 'off');
        console.log('heater off')
    },

    temp_data: function () {
        // TODO: get value from sensor.
        temp_data = 18;

        thermostat.emit({
          type: 'temperature',
          value: temp_data
        });
    },

    check_temp_data: function () {
        let threshold = this.get('threshold');
        let correction = thermostat.ctr.update(temp_data);

        console.log(correction);

        // Our heater is on/off
        if (correction > threshold && this.get('state') !== 'off') {
            thermostat.call('turn_heater_on');
        } else if (this.get('state') !== 'off'){
            thermostat.call('turn_heater_off');
        }
    }
});

// TODO update target of controller if the target prop is changed
thermostat.on('property-updated', function (prop) {
    switch(prop) {
        case 'target':
          thermostat.ctr.setTarget(target);
          break;
        case 'interval': 
          clearInterval(emit_and_analyze);
          // Restart.
          thermostat.call('start');
          break;
        default:
          break;
    }
});
