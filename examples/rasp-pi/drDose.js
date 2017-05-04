const Grow = require('../../lib/Grow.js');
const raspio = require('raspi-io');
const five = require('johnny-five');
const ascii = require('ascii-codes');
const growfile = require('../growfiles/tomato');
const Controller = require('node-pid-controller');

const phCtr = new Controller({
  k_p: 0.25,
  k_i: 0.01,
  k_d: 0.01,
  dt: 1
});

const ecCtr = new Controller({
  k_p: 0.25,
  k_i: 0.01,
  k_d: 0.01,
  dt: 1
});

// Create a new board object
var board = new five.Board({
  io: new raspio()
});

// When board emits a 'ready' event run this start function.
board.on('ready', function start() {

  var pH_reading,
    pH_readings = [],
    eC_reading,
    eC_readings = [],
    acidpump = new five.Pin('P1-11'),
    basepump = new five.Pin('P1-12'),
    nutrientpump = new five.Pin('P1-13');

  // Hack: Relays are inversed... make sure pumps are off.
  // Better hardware could take care of this... I'm not an electrical engineer.
  acidpump.high();
  basepump.high();
  nutrientpump.high();


  // Create a new grow instance and connect to https://grow.commongarden.org
  var grow = new Grow({
    uuid: null,
    token: null,
    name: 'Dr. Dose', // The display name for the thing.
    desription: 'Dr. Dose keeps your pH and nutrients balanced.',

    // Properties can be updated by the API
    properties: {
      ph_state: null,
      ec_state: null,
      growfile: growfile,
      interval: 5000,
      threshold: 0.1,
    },

    start: function () {
      // This must be called prior to any I2C reads or writes.
      // See Johnny-Five docs: http://johnny-five.io
      board.i2cConfig();

      // Read response.
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

      // Read response.
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

      let interval = this.get('interval');
      
      setInterval(()=> {
        this.ph_data();
        this.ec_data();
      }, interval);

      if (growfile.targets.ph.ideal) {
        phCtr.setTarget(growfile.targets.ph.ideal)
      }

      if (growfile.targets.ec.ideal) {
        ecCtr.setTarget(growfile.targets.ec.ideal)
      }

      this.registerAlerts(growfile.targets);
    },

    acid: function (duration) {
      acidpump.low();

      var duration = Number(grow.get('duration', 'acid'));
      setTimeout(function () {
        acidpump.high();
      }, duration);
    },
    
    base: function (duration) {
      basepump.low();

      setTimeout(function () {
        basepump.high();
      }, duration);
    },

    nutrient: function (duration) {
      nutrientpump.low();

      setTimeout(function () {
        nutrientpump.high();
      }, duration);
    },

    ec_data: function () {
      // Request a reading
      board.i2cWrite(0x64, [0x52, 0x00]);

      eC_reading = this.parseEC(eC_reading);

      console.log('EC: ' + eC_reading);

      let threshold = this.get('threshold');
      let correction = ecCtr.update(eC_reading);
      if (correction > threshold) {
        console.log('EC correction: ' + correction);
        if (correction * 1000 > 100) {
          // this.call('base', correction * 1000)
        }
        // Todo: add water pump.
      }

      grow.emit({
        type: 'ec',
        value: eC_reading
      });
    },

    ph_data: function () {
      // Request a reading
      board.i2cWrite(0x63, [0x52, 0x00]);

      console.log('pH: ' + pH_reading);

      // Filter out non-readings
      // if (this.ispH(pH_reading)) {
      let threshold = this.get('threshold');
      let correction = phCtr.update(pH_reading);
      console.log('pH correction: ' + correction);

      if (correction > threshold) {
        if (correction * 1000 > 100) {
          // this.call('base', correction * 1000)
        }
      }

      // Send data to the Grow-IoT app.
      grow.emit({
        type: 'pH',
        value: pH_reading
      });
      // }
    }
  });

  // grow.connect({
  //   host: 'grow.commongarden.org',
  //   port: 443,
  //   ssl: true
  // });
});
