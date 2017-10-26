// Require the Grow.js build and johnny-five library.
const Thing = require('Grow.js');
const five = require('johnny-five');
const later = require('later');
const math = require('mathjs');

const VREF = 5000; //for arduino uno, the ADC reference is the power(AVCC), that is 5000mV

// Use local time, not UTC.
later.date.localTime();

// See http://johnny-five.io/ to connect devices besides arduino.
const board = new five.Board();

// When board emits a 'ready' event run this start function.
board.on('ready', function start() {
  // Define variables
  var power = new five.Pin(13),
    ecSensor = new five.Sensor('A0'),
    phSensor = new five.Sensor('A1');

  power.high();

  // Create a new thing.
  var light = new Thing({
    uuid: 'meow',
    token: 'meow',

    component: 'PlusFarm',

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
      
      this.interval = setInterval(()=> {
        this.ph_data();
        this.ec_data();
        // light.check_light_data();
      }, interval);

      this.ec_buffer = [];
      this.ph_buffer = [];

      // this.parseCycles(this.get('cycles'));
    },

    // To do: add to Grow.js with calibration....
    parse_ec: function (value) {
      this.ec_buffer.push(value);
      if (this.ec_buffer.length > 10) {
        this.ec_buffer.shift()
      }
      let AnalogAverage = math.median(this.ec_buffer);
      let averageVoltage= AnalogAverage*VREF/1024.0;
      let temperature = 25.0; //when no temperature sensor ,temperature should be 25^C default
      let TempCoefficient=1.0+0.0185*(temperature-25.0); //temperature compensation formula: fFinalResult(25^C) = fFinalResult(current)/(1.0+0.0185*(fTP-25.0));
      let CoefficientVolatge = averageVoltage/TempCoefficient;   
      if(CoefficientVolatge>3300) {
        console.log('Out of the range!'); //>20ms/cm,out of the range
      }
      else{ 
        let ECvalue;
        ECvalue=5.3*CoefficientVolatge+2278; //10ms/cm<EC<20ms/cm
        ECvalue = ECvalue/10.0;
        return ECvalue;
      }
    },

    // To do: add to Grow.js with calibration....
    parse_ph: function (value) {
      this.ph_buffer.push(value);
      let AnalogAverage = math.median(this.ph_buffer);
      let averageVoltage= AnalogAverage*(5.0/1024);
      if (this.ph_buffer.length > 10) {
        this.ph_buffer.shift()
      }
      return averageVoltage * 3.5 - 1;
    },

    stop: function () {
      clearInterval(this.interval);
      this.removeAllListeners();
    },

    ph_data: function () {
      let value = this.parse_ph(phSensor.value);
      light.emit('ph', value);
    },

    ec_data: function () {
      let value = this.parse_ec(ecSensor.value);
      light.emit('ec', value);
    },
  });

  light.connect({});
});
