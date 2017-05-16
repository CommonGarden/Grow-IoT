const Grow = require('../../lib/Grow.js');
const ascii = require('ascii-codes');
const raspio = require('raspi-io');
const five = require('johnny-five');

// Create a new board object
const board = new five.Board({
  io: new raspio()
});

// When board emits a 'ready' event run this start function.
board.on('ready', function start() {
  // Declare needed variables.
  var pH_reading, eC_reading, water_temp, emit_data;

  // Create a new growHub instance and connect to https://growHub.commongarden.org
  var growHub = new Grow({
    uuid: 'PASTE_UUID_HERE',
    token: 'PASTE_TOKEN_HERE',

    // Make a component for this example.
    component: 'TentacleExample',

    // Properties can be updated by the API
    properties: {
      interval: 5000,
    },

    start: function () {
      // This must be called prior to any I2C reads or writes.
      // See Johnny-Five docs: http://johnny-five.io
      board.i2cConfig();

      // Set up I2C listeners
      // Read from Atlas Scientific Conductivity sensor
      board.i2cRead(0x64, 32, function (bytes) {
        var bytelist = [];
        if (bytes[0] === 1) {
          // console.log(bytes);
          for (i = 0; i < bytes.length; i++) {
            if (bytes[i] !== 1 && bytes[i] !== 0) {
              bytelist.push(ascii.symbolForDecimal(bytes[i]));
            }
          }
          eC_reading = bytelist.join('');
        }
      });

      // Read from Atlas Scientific pH sensor
      board.i2cRead(0x63, 7, function (bytes) {
        var bytelist = [];
        if (bytes[0] === 1) {
          for (i = 0; i < bytes.length; i++) {
            if (bytes[i] !== 1 && bytes[i] !== 0) {
              bytelist.push(ascii.symbolForDecimal(bytes[i]));
            }
          }
          pH_reading = bytelist.join('');
        }
      });

      // Read from Atlas Scientific temperature sensor
      board.i2cRead(0x66, 7, function (bytes) {
        var bytelist = [];
        if (bytes[0] === 1) {
          for (i = 0; i < bytes.length; i++) {
            if (bytes[i] !== 1 && bytes[i] !== 0) {
              bytelist.push(ascii.symbolForDecimal(bytes[i]));
            }
          }
          water_temp = bytelist.join('');
        }
      });

      var interval = this.get('interval');

      emit_data = setInterval(()=> {
        this.ph_data();
        this.ec_data();
        this.water_temp_data();
      }, interval);
    },

    stop: function () {
      clearInterval(emit_data);
      this.removeAllListeners();
    },
    
    ec_data: function () {
      // Request a reading, 
      board.i2cWrite(0x64, [0x52, 0x00]);

      eC_reading = this.parseEC(eC_reading);

      if (eC_reading) {
        this.emit({
          type: 'ec',
          value: eC_reading
        });

        console.log('Conductivity: ' + eC_reading);
      }
    },

    ph_data: function () {
      // Request a reading
      board.i2cWrite(0x63, [0x52, 0x00]);

      if (this.ispH(pH_reading)) {
        this.emit({
          type: 'ph',
          value: pH_reading
        });

        console.log('ph: ' + pH_reading);
      }
    },


    water_temp_data: function () {
      // Request a reading
      board.i2cWrite(0x66, [0x52, 0x00]);

      this.emit({
        type: 'water_temperature',
        value: water_temp
      });

      console.log('Resevoir temp: ' + water_temp);
    },
  });

  growHub.connect({
    host: '10.0.0.198',
  });

  // Default is http://localhost:3000
  // growHub.connect({
  //   host: 'grow.commongarden.org',
  //   port: 443,
  //   ssl: true
  // });
});
