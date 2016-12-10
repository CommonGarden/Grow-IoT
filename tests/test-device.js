var Thing = require('Grow.js');
var args = process.argv.slice(2);
var uuid = args[0];
var token = args[1];
var type = args[2];
var testDevice = new Thing({
  // PUT YOUR UUID AND TOKEN HERE: |||||||||||||||
  uuid: uuid,
  token: token,

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
      type: type,
      value: temp
    });
  }
});

testDevice.connect();
