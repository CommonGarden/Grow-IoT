var Thing = require('Grow.js');

var testDevice = new Thing({
  // PUT YOUR UUID AND TOKEN HERE: |||||||||||||||
  uuid: 'Paste_UUID_here',
  token: 'Paste_TOKEN_here',

  testDevice: true, // HACK, unfortunately needed for now...
  component: 'test-device', // The future...

  properties: {
    state: 'off'
  },

  start: function () {
    setInterval(()=> {
      testDevice.call('temp_data');
    }, 3000);
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

    console.log(temp);

    testDevice.emit({
      type: 'temperature',
      value: temp
    });
  }
});

testDevice.connect();
