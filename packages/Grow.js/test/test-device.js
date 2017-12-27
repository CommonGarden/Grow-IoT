const Thing = require('../lib/Grow.js');

const testDevice = new Thing({
  // PUT YOUR UUID AND TOKEN HERE OR SUPPLY THEM AS ARGUMENTS
  uuid: 'u',
  token: 't',
  component: 'TestDevice',

  properties: {
    state: 'off',
    interval: 3000,
    targets: {
      min: 15,
      ideal: 50,
      max: 80,
    }
  },

  start: function () {
    setInterval(()=> {
      this.temp_data();
    }, this.get('interval'));
  },

  turn_on: function () {
    console.log('on');
    testDevice.set('state', 'on');
  },

  turn_off: function () {
    console.log('off');
    testDevice.set('state', 'off');
  },

  temp_data: function () {
    let temp = Math.random() * 100;

    testDevice.emit('temperature', temp);
  }
}, 'state.json');

