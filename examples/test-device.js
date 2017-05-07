var Thing = require('../dist/Grow.umd.js');

var testDevice = new Thing({
  // PUT YOUR UUID AND TOKEN HERE!!!
  uuid: '0edc307c-5054-44a3-9769-1ef3afc082c8',
  token: 'MSbMLBzBxfKPPxZA9JfS2vMqWqHSTSNH',

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

    console.log(temp);

    this.emit({
      type: 'temperature',
      value: temp
    });
  }
});

// Defaults to localhost:3000/
testDevice.connect();

