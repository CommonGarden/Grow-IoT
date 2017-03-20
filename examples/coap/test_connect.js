const Thing = require('../../lib/Thing.js');
const light = require('../things/light');
const coap = require('coap');

// This example sucks, make i
const Light = new Thing({
  uuid: '44ce5f56-722d-4262-9901-0e46598944c9',
  token: '5Qp4Rh4Z9P6Ha2cETDBoS5ENWxs54hgf',

  component: 'test-device',

  properties: {
    state: 'off',
    interval: 3000
  },

  start: function () {
    setInterval(()=> {
      this.call('temp_data');
    }, this.get('interval'));
  },

  turn_on: function () {
    console.log('on');
    Light.set('state', 'on');
  },

  turn_off: function () {
    console.log('off');
    Light.set('state', 'off');
  },

  temp_data: function () {
    let temp = Math.random() * 100;

    console.log(temp);

    this.emit({
      type: 'temperature',
      value: temp
    });
  }
});

Light.connect();
// Light.call('turn_on');
