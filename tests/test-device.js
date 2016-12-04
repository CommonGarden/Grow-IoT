// Import the latest build of the Grow.js library
var Thing = require('Grow.js');

// Create a new grow instance. Connects by default to localhost:3000
var testDevice = new Thing({
  // PUT YOUR UUID AND TOKEN HERE:
  uuid: '6e42b6d8-1c3b-4a69-9527-4b8d20f8486c',
  token: 'nLoyuaKpuMG4nCZTYfuRHQtoMFKPbb2j',

  // HACK, unfortunately needed for now...
  testDevice: true,

  // Properties can be updated by the API
  properties: {
    state: 'off'
  },

  start: function () {
    setInterval(()=> {
      testDevice.call('temp_data');
    }, 3000);
  },

  turn_on: function () {
    testDevice.set('state', 'on');
  },

  turn_off: function () {
    console.log('test');
    testDevice.set('state', 'off');
  },

  temp_data: function () {
    let temp = Math.random() * 100;

    // Send data to the Grow-IoT app.
    testDevice.emit({
      type: 'temperature',
      value: temp
    });
  }
});

testDevice.connect();
