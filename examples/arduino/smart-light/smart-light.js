// Require the Grow.js build and johnny-five library.
const Thing = require('../../../lib/Grow.js');
const five = require('johnny-five');
const later = require('later');

// Use local time, not UTC.
later.date.localTime();

// See http://johnny-five.io/ to connect devices besides arduino.
const board = new five.Board();

// When board emits a 'ready' event run this start function.
board.on('ready', function start() {
  // Define variables
  var power = new five.Pin(13),
    LED = new five.Pin(12),
    lightSensor = new five.Sensor('A1');

  power.high();

  // Create a new thing.
  var light = new Thing({
    uuid: '0ec45202-9c0d-4ad7-b19e-8720abe5d23a',
    token: 'B5SjPqxrRksvSfn8bLFREcGmo6bHqf36',

    component: 'SmartLight',

    properties: {
      state: 'off',
      threshold: 300,
      interval: 3000,
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

    // power_data: function () {
    //   if (this.light) {
    //     this.light.getInfo().then((data)=> {
    //       let powerData = data.consumption.get_realtime;
    //       this.emit({
    //         type: 'power',
    //         value: powerData
    //       });
    //     });
    //   }
    // },

    turn_on: function () {
      LED.high();
      this.set('state', 'on');
      console.log('light on');
    },

    turn_off:  function () {
      LED.low();
      this.set('state', 'off');
      console.log('light off');
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

  light.connect({
    port: 3001
  });
});
