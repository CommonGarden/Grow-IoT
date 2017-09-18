var Thing = require('../dist/Grow.umd.js');

var testDevice = new Thing({
  // PUT YOUR UUID AND TOKEN HERE!!!
  uuid: '76736ac1-e2cc-4702-ad53-f8b3e23ec73c',
  token: 'PkWmetAXAH8tCFaMm3Pu4avFuhLa7pRf',

  component: 'TestDevice',

  properties: {
    state: 'off'
  },

  start: function () {
    setInterval(()=> {
      this.call('temp_data');
    }, 3000);
  },

  turn_on: function () {
    console.log('on');
    this.set('state', 'on');
  },

  turn_off: function () {
    console.log('off');
    this.set('state', 'off');
  },

  temp_data: function () {
    let temp = Math.random() * 100;
    this.emit('temperature', temp);
    console.log(temp);
  }
});

// Defaults to localhost:3000/
testDevice.connect();

