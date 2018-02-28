let Thing = require('Grow.js');

let testDevice = new Thing({
  uuid: 'test',
  token: 'test',

  component: 'Thermostat',

  // Properties can be updated by the API
  properties: {
    state: 'off',
    growfile: {
      temperature: {
        min: 1,
        ideal: 4,
        max: 9,
        pid: {
          k_p: 300,
          k_i: 0,
          k_d: 200,
          dt: 1
        }
      },
    },
    interval: 1000,
    threshold: 0.2,
  },

  start: function () {
    var interval = this.get('interval');
    data_interval = setInterval(()=> {
        this.temp_data();
    }, interval);

    var growfile = this.get('growfile');
    this.registerTargets(growfile);

    var threshold = this.get('threshold');

    // Listen for correction events from our PID controller
    this.on('correction', (key, correction) => {
      // console.log(key, correction);
      if (Math.abs(correction) > threshold) {
        if (key === 'temperature') {
          if (correction > 0) {
            this.call('turn_on');
          } else {
            this.call('turn_off');
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

  temp_data: function () {
    let temp = Math.random() * 10;
    this.emit('temperature', temp);

      console.log('temperature: ' + temp);

      return temp;
  }
});

testDevice.connect();
