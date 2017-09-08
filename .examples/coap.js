var Thing = require('../dist/Thing.js');

var testDevice = new Thing({
  // PUT YOUR UUID AND TOKEN HERE!!!
  uuid: 'test',
  token: '1234',

  component: 'TestDevice',

  properties: {
    state: 'off'
  },

  turn_on: function () {
    console.log('on');
    this.set('state', 'on');
  },

  turn_off: function () {
    console.log('off');
    this.set('state', 'off');
  },

  temperature: function (reading) {
    console.log("temperature: " + reading);
  },

  humidity: function (reading) {
    console.log("humidity: " + reading)
  }
});

// Defaults to localhost:3000/
testDevice.listen();

