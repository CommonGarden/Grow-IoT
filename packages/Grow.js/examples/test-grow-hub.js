let Thing = require('../lib/Grow.js');
let types = require('./types.js');

let testDevice = new Thing({
  uuid: 'test',
  token: 'test',

  component: 'NewHub',

  // Properties can be updated by the API
  properties: {
    state: 'off',
    types: types,
    automation_enabled: false,
    growfile: {
      temperature: {
        min: 0,
        ideal: 4,
        max: 100,
        threshold: 1,
      },
      humidity: {
        min: 0,
        ideal: 4,
        max: 100,
        threshold: 1,
      },
      pressure: {
        min: 0,
        ideal: 4,
        max: 100,
        threshold: 1,
      },
      co2: {
        min: 0,
        ideal: 4,
        max: 100,
        threshold: 1,
      },
      ph: {
        min: 0,
        ideal: 4,
        max: 100,
        threshold: 1,
      },
      ec: {
        min: 0,
        ideal: 4,
        max: 100,
        threshold: 1,
      },
    },
    interval: 1000,
    threshold: 0.2,
  },

  start: function () {
    var interval = this.get('interval');
    data_interval = setInterval(()=> {
        this.emit_data();
    }, interval);

    var growfile = this.get('growfile');
    this.registerTargets(growfile);

    var threshold = this.get('threshold');

    // Listen for correction events from our PID controller
    this.on('correction', (key, correction) => {
      console.log(key, correction);
      let automation_enabled = this.get('automation_enabled');
      if (automation_enabled) {
        if (Math.abs(correction) > threshold) {
          if (key === 'temperature') {
            if (correction > 0) {
              this.call('turn_on');
            } else {
              this.call('turn_off');
            }
          }
        }
      }
    });
  },

  stop: function () {
    clearInterval(data_interval);
    this.removeAllListeners();
  },

  restart: function () {
    this.stop();
    this.removeTargets();
    this.start();
  },

  // Note, there are probably more elegant ways of handling subthing methods.
  turn_on: function () {
    console.log('Heater on');
    this.set('state', 'on');
  },

  turn_off: function () {
    console.log('Heater off');
    this.set('state', 'off');
  },

  emit_data: function () {
    this.emit('temperature', Math.random() * 10);
    this.emit('humidity', Math.random() * 10);
    this.emit('pressure', Math.random() * 10);
    this.emit('lux', Math.random() * 10);
    this.emit('co2', Math.random() * 10);
    this.emit('water_temperature', Math.random() * 10);
    this.emit('ph', Math.random() * 10);
    this.emit('ec', Math.random() * 10);
    this.emit('orp', Math.random() * 10);
    this.emit('dissolved_oxygen', Math.random() * 10);
  }
});

testDevice.connect({
    //host: 'grow.commongarden.org',
    //port: 443,
    //ssl: true
});
