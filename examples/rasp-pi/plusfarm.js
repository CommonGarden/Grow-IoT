const Grow = require('../../dist/Grow.js');
const ascii = require('ascii-codes');
const http = require('http');
const url = require('url');
const raspio = require('raspi-io');
const five = require('johnny-five');
const later = require('later');
const Hs100Api = require('hs100-api');
const _ = require('underscore');
const fs = require('fs');
const spawn = require('child_process').spawn;

// Use local time, not UTC.
later.date.localTime();

// Create a new board object
const board = new five.Board({
  io: new raspio()
});

// When board emits a 'ready' event run this start function.
board.on('ready', function start() {
  // Declare needed variables.
  var pH_reading, eC_reading, water_temp, emit_data;

  var floatSwitch = new five.Pin('P1-7');

  var multi = new five.Multi({
    controller: 'BME280'
  });

  var lux = new five.Light({
    controller: 'TSL2561'
  });

  var plusfarm = new Grow({
    uuid: 'meow',
    token: 'meow',
    component: 'PlusFarm',

    properties: {
      light_state: null,
      pump_state: null,
      water_level: null,
      duration: 2000,
      interval: 6000,
      growfile: {
        targets: {
          ph: {
            min: 5.9,
            max: 7.5
          },
          ec: {
            min: 200,
            max: 1500
          },
          temperature: {
            min: 10,
            max: 25
          },
          humidity: {
            min: 10,
            max: 80
          },
        }
      },
      targets: {},
    },

    start: function () {
      console.log('Grow-Hub initialized.');

      // This must be called prior to any I2C reads or writes.
      // See Johnny-Five docs: http://johnny-five.io
      board.i2cConfig();

      board.i2cRead(0x64, 32, function (bytes) {
        let eC = Grow.parseAtlasEC(bytes);
        if (eC) eC_reading = eC;
      });

      board.i2cRead(0x63, 7, function (bytes) {
        let pH = Grow.parseAtlasPH(bytes);
        if (pH) pH_reading = pH;
      });

      // // Uncomment to use an Atlas Scientific temp probe
      // board.i2cRead(0x66, 7, function (bytes) {
      //   let temp = Grow.parseAtlasTemperature(bytes);
      //   if (temp) water_temp = temp;
      // });

      var interval = this.get('interval');

      emit_data = setInterval(()=> {
        this.temp_data();
        this.hum_data();
        this.ph_data();
        this.ec_data();
        this.light_data();
        this.water_temp_data();
        floatSwitch.read(function(error, value) {
          console.log(value);
        });
      }, interval);

      let growfile = this.get('growfile');
      this.registerTargets(growfile.targets);
    },

    stop: function () {
      clearInterval(emit_data);
      this.removeAllListeners();
      this.removeTargets();
    },

    restart: function () {
      this.stop();
      this.start();
    },
    
    day: function () {
      console.log('It is day!');
      this.call('turn_light_on');
    },

    night: function () {
      console.log('It is night!');
      this.call('turn_light_off');
    },

    // Note, there are probably more elegant ways of handling subthing methods.
    turn_light_on: function () {
      console.log('Light on');
      var process = spawn('dlipower', ['--hostname', '192.168.0.100', '--user', 'admin', '--password', '1234', 'on', '1']);
      this.set('light_state', 'on');
    },

    turn_light_off: function () {
      console.log('Light off');
      var process = spawn('dlipower', ['--hostname', '192.168.0.100', '--user', 'admin', '--password', '1234', 'off', '1']);
      this.set('light_state', 'off');
    },

    // Note, there are probably more elegant ways of handling subthing methods.
    turn_pump_on: function () {
      console.log('Light on');
      var process = spawn('dlipower', ['--hostname', '192.168.0.100', '--user', 'admin', '--password', '1234', 'on', '2']);
      this.set('pump_state', 'on');
    },

    turn_pump_off: function () {
      console.log('Light off');
      var process = spawn('dlipower', ['--hostname', '192.168.0.100', '--user', 'admin', '--password', '1234', 'off', '2']);
      this.set('pump_state', 'off');
    },

    ec_data: function () {
      // Request a reading, 
      board.i2cWrite(0x64, [0x52, 0x00]);

      if (eC_reading) {
        this.emit('ec', eC_reading);

        console.log('Conductivity: ' + eC_reading);
      }
    },

    ph_data: function () {
      // Request a reading
      board.i2cWrite(0x63, [0x52, 0x00]);

      if (pH_reading) {
        this.emit('ph', pH_reading);

        console.log('ph: ' + pH_reading);
      }
    },

    light_data: function () {
      this.emit('lux', 500);
    },


    water_temp_data: function () {
      // Request a reading
      // board.i2cWrite(0x66, [0x52, 0x00]);
      water_temp = 22;

      this.emit('water_temperature', water_temp);

      console.log('Resevoir temp: ' + water_temp);
    },

    temp_data: function () {
      var currentTemp = multi.thermometer.celsius;

      this.emit('temperature', currentTemp);

      console.log('Temperature: ' + currentTemp);
    },

    hum_data: function () {
      var currentHumidity = multi.hygrometer.relativeHumidity;

      this.emit('humidity', currentHumidity);

      console.log('Humidity: ' + currentHumidity);
    }
  });

  plusfarm.connect({
    host: '10.0.0.198',
    port: 3000
  });
});
