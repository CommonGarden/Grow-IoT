// Require the Grow.js build and johnny-five library.
const Thing = require('../../../dist/Grow.js');
const five = require('johnny-five');
const later = require('later');
const Hs100Api = require('hs100-api');

// Use local time, not UTC.
later.date.localTime();

// See http://johnny-five.io/ to connect devices besides arduino.
const board = new five.Board();

// When board emits a 'ready' event run this start function.
board.on('ready', function start() {
  // Define variables
  var power = new five.Pin(11),
    LED = new five.Pin(13),
    lightSensor = new five.Sensor('A1');

  power.high();

  // Create a new thing.
  var light = new Thing({
    uuid: 'meow',
    token: 'meow',

    component: 'SmartLight',

    component: 'https://mywebcomponent.com/mycomponent',

    properties: {
      state: 'off',
      threshold: 300,
      interval: 1000,
      currently: null,
      lightconditions: null,
      cycles: {
        day: {
          schedule: 'after 7:00am'
        },
        night: {
          schedule: 'after 8:00pm'
        }
      }
    },

    start: function () {
      var interval = this.get('interval');
      
      this.interval = setInterval(function () {
        light.light_data();
        light.check_light_data();
      }, interval);

      var client = new Hs100Api.Client();

      client.startDiscovery().on('plug-new', (plug) => {
        if (plug.name === 'tplinkplug1') {
          console.log('Light connected');
          this.light = plug;
          this.light.getInfo().then((data)=> {
            if (data.sysInfo.relay_state === 1) {
              this.set('state', 'on');
            } else {
              this.set('state', 'off');
            }
          }).catch(
            (reason) => {
              console.log('Handle rejected promise ('+reason+') here.');
            }
          );
        }
      });

      this.parseCycles(this.get('cycles'));
    },

    stop: function () {
      clearInterval(this.interval);
      this.removeAllListeners();
    },

    day: function () {
      console.log('It is day!');
      this.set('currently', 'day');
      this.call('turn_on');
    },

    night: function () {
      console.log('It is night!');
      this.set('currently', 'night');
      this.call('turn_off');
    },

    turn_on: function () {
      console.log('Light on');
      if (this.light) {
        this.light.setPowerState(true);
      }          
      this.set('light_state', 'on');
    },

    turn_off: function () {
      console.log('Light off');
      if (this.light) {
        this.light.setPowerState(false);
      }          
      this.set('light_state', 'off');
    },

    light_data: function () {
      let value = lightSensor.value;
      light.emit('light', value);
    },

    check_light_data: function () {
      let threshold = this.get('threshold');
      let state = this.get('state');
      let currently = this.get('currently');

      if ((lightSensor.value < threshold) &&
        (this.get('lightconditions') !== 'dark') &&
        (currently === 'day')) {

        console.log('Too dark for daylight hours, turning on light.')
        this.set('lightconditions', 'dark');
        this.call('turn_on');
      }

      else if ((lightSensor.value >= threshold) &&
        (this.get('lightconditions') !== 'light') &&
        (currently === 'day')) {

        this.set('lightconditions', 'light');
        this.call('turn_off');
      }
    }
  });

  light.connect({});
});
