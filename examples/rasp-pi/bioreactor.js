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

// Declare variables
let pH_reading,
  eC_reading,
  DO_reading,
  emit_data,
  water_temp,
  heater,
  airlift,
  aerator,
  water_pump,
  multi,
  lux;

const nano = new five.Board();

// When board emits a 'ready' event run this start function.
nano.on('ready', function start() {
  // Define variables
  heater = new five.Pin(6);
  airlift = new five.Pin(7);
  aerator = new five.Pin(8);
  water_pump = new five.Pin(9);

  // This requires OneWire support using the ConfigurableFirmata
  let thermometer = new five.Thermometer({
    controller: 'DS18B20',
    pin: 4
  });

  thermometer.on('change', function() {
    // console.log(this.celsius + "°C");
    water_temp = this.celsius;
  });
});


// Create a new board object
const board = new five.Board({
  io: new raspio()
});

// When board emits a 'ready' event run this start function.
board.on('ready', function start() {
  // // Uncomment to enable climate sensor.
  // let multi = new five.Multi({
  //   controller: 'BME280'
  // });

  // // Uncomment to enable light sensor.
  // let lux = new five.Light({
  //   controller: 'TSL2561'
  // });

  const bioreactor = new Grow({
    uuid: 'meow',
    token: 'meow',
    component: 'BioReactor',
    properties: {
      light_state: null,
      heater: 'off',//1
      airlift: 'off',//2
      aerator: 'off',//3
      water_pump: 'off',//4
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
            max: 26
          },
          humidity: {
            min: 10,
            max: 60
          },
        },
        cycles: {
          day: {
            schedule: 'after 7:00am',
          },
          night: {
            schedule: 'after 7:00pm',
          }
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

      // Todo: make static helper for Grow.js
      board.i2cRead(0x61, 14, function (bytes) {
        var bytelist = [];
        if (bytes[0] === 1) {
          for (i = 0; i < bytes.length; i++) {
            if (bytes[i] !== 1 && bytes[i] !== 0) {
              bytelist.push(ascii.symbolForDecimal(bytes[i]));
            }
          }
          DO_reading = bytelist.join('');
        }
      });

      setTimeout(()=> {
        this.call('airlift_off');
        this.call('aerator_off');
        this.call('heater_off');
        this.call('water_pump_off');
      }, 3000);

      var interval = this.get('interval');

      emit_data = setInterval(()=> {
        this.temp_data();
        this.hum_data();
        this.ph_data();
        this.ec_data();
        this.light_data();
        this.water_temp_data();
        setTimeout(()=> {
          this.do_data();
        }, 1000);
      }, interval);
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
      this.call('airlift_on');
    },

    night: function () {
      console.log('It is night!');
      this.call('airlift_off');
    },

    airlift_on: function () {
      airlift.low();
      this.set('airlift', 'on');
    },

    airlift_off: function () {
      airlift.high();
      this.set('airlift', 'off');
    },

    aerator_on: function () {
      aerator.low();
      this.set('aerator', 'on');
    },

    aerator_off: function () {
      aerator.high();
      this.set('aerator', 'off');
    },

    heater_on: function () {
      heater.low();
      this.set('heater', 'on');
    },

    heater_off: function () {
      heater.high();
      this.set('heater', 'off');
    },

    water_pump_on: function () {
      water_pump.low();
      this.set('water_pump', 'on');
    },

    water_pump_off: function () {
      water_pump.high();
      this.set('water_pump', 'off');
    },

    ec_data: function () {
      // Request a reading, 
      board.i2cWrite(0x64, [0x52, 0x00]);

      this.emit('ec', eC_reading);

      console.log('Conductivity: ' + eC_reading);
    },

    ph_data: function () {
      // Request a reading
      board.i2cWrite(0x63, [0x52, 0x00]);

      this.emit('ph', pH_reading);

      console.log('ph: ' + pH_reading);
    },

    do_data: function () {
      // Request a reading
      board.i2cWrite(0x61, [0x52, 0x00]);

      this.emit('dissolved_oxygen', DO_reading);

      console.log('Dissolved oxygen: ' + DO_reading);
    },

    water_temp_data: function () {
      this.emit('water_temperature', water_temp);

      console.log('Temperature: ' + water_temp);
    },

    light_data: function () {
      if (!_.isUndefined(lux)) {
        let light_data = lux.level;

        this.emit('lux', light_data);

        console.log('Lux: ' + light_data)
      }
    },

    temp_data: function () {
      if (!_.isUndefined(multi)) {
        var currentTemp = multi.thermometer.celsius;

        this.emit('temperature', currentTemp);

        console.log('Temperature: ' + currentTemp);
      }
    },

    hum_data: function () {
      if (!_.isUndefined(multi)) {
        var currentHumidity = multi.hygrometer.relativeHumidity;

        this.emit('humidity', currentHumidity);

        console.log('Humidity: ' + currentHumidity);
      }
    }
  }).connect({
    host: '10.0.0.14'
  });
});

