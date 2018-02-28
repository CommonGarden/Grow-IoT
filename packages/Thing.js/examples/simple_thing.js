let Thing = require('../lib/Thing.js');

let testDevice = new Thing({
  uuid: 'test',
  token: 'test',

  component: 'Thermostat',

  // Properties can be updated by the API
  properties: {
    state: 'off',
    interval: 1000,
    threshold: 0.2,
  },

  start: function () {
    var interval = this.get('interval');
    data_interval = setInterval(()=> {
        this.temp_data();
    }, interval);
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
}, './data');

testDevice.ddpconnect();
