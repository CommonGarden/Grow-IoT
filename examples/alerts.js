const Thing = require('../lib/Grow.js');
const _ = require('underscore');

const Light = new Thing({  
  properties: {
    state: null,
    targets: {
      temperature: 24,
      humidity: {
        min: 51,
        max: 61
      },
      // Protip: C02 emitter should be timed in relation to exhaust fan so that C02 is not sucked out of room.
      co2: {
        min: 900,
        max: 1600
      }
    }
  },

  start: function () {
    let targets = this.get('targets');
    
    this.registerAlerts(targets);

    this.on('alert', (key, message)=> {
      console.log('Alert: ' + key + ' ' + message);
    })
  },

  turn_light_on: function () {
    console.log('light on');
    Light.set('state', 'on');
  },

  turn_light_off: function () {
    console.log('light off');
    Light.set('state', 'off');
  }
});

Light.emit('humidity', {value: 2});
Light.emit('humidity', {value: 55});
Light.emit('humidity', {value: 70});

