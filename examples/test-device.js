var Thing = require('../dist/Grow.umd.js');

var testDevice = new Thing({
  // PUT YOUR UUID AND TOKEN HERE!!!
  uuid: 'ef890d71-0137-4253-a130-f328615043bf',
  token: '7kQbxeCr4R4q7YwCih6PsPCKTLrLiSd4',

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

growHub.connect({
  host: 'grow.commongarden.org',
  port: 443,
  ssl: true
});
