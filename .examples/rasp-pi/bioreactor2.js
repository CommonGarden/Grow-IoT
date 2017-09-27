const Grow = require('Grow.js');
const raspio = require('raspi-io');
const five = require('johnny-five');
const later = require('later');
const _ = require('underscore');
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
  level,
  level_ref,
  lux;

// We use a setTimeout here to make sure the nano is fully setup.
setTimeout(()=> {
  // Create a new board object
  const board = new five.Board({
    io: new raspio()
  });

  // When board emits a 'ready' event run this start function.
  board.on('ready', function start() {

  	// Define variables
  	circ_pump = new five.Pin('GPIO-26');
  	doser = new five.Pin('GPIO-20');
  	heater = new five.Pin('GPIO-21');

    let bioreactor = new Grow({
      uuid: 'meow',
      token: 'meow',
      component: 'BioReactor',
      properties: {
        light_state: null,
        heater: 'off',//1
        circ_pump: 'off',//2
        doser: 'off',//3
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
              min: 19,
              ideal: 22,
              max: 29,
              pid: {
                k_p: 300,
                k_i: 0,
                k_d: 200,
                dt: 1
              }
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

        board.i2cRead(0x64, 32, (bytes)=> {
          let eC = this.parseAtlasEC(bytes);
          if (eC) eC_reading = eC;
        });

        board.i2cRead(0x63, 7, (bytes)=> {
          let pH = this.parseAtlasPH(bytes);
          if (pH) pH_reading = pH;
        });


        board.i2cRead(0x61, 14, (bytes)=> {
          let DO = this.parseAtlasDissolvedOxygen(bytes);
          if (DO) DO_reading = DO;
        });

        setTimeout(()=> {
          this.circ_pump_off();
          this.doser_off();
          this.heater_off();

          multi = new five.Multi({
            controller: 'BME280'
          });

          // // Uncomment to enable light sensor.
          // let lux = new five.Light({
          //   controller: 'TSL2561'
          // });
        }, 3000);

        var interval = this.get('interval');

        emit_data = setInterval(()=> {
          this.temp_data();
          this.hum_data();
          this.light_data();
          this.circ_pump_on();
          this.air_pressure_data();
          this.water_level_data();
          setTimeout(()=> {
            this.ph_data();
            this.ec_data();
            this.water_temp_data();
            setTimeout(()=> {
              this.do_data();
              this.circ_pump_off();
            }, 1000);
          }, 30000)
        }, interval > 60000 ? interval: 60000);

        let growfile = this.get('growfile');
        this.startGrow(growfile);

        this.emit('message', 'Running')
      },

      stop: function () {
        this.emit('message', 'Stopped');
        clearInterval(emit_data);
        this.removeAllListeners();
        this.removeTargets();
      },

      restart: function () {
        this.emit('message', 'Restarting');
        this.stop();
        this.start();
      },
      
      feed: function () {
      	console.log('Feeding time!')
      }

      day: function () {
        console.log('It is day!');
      },

      night: function () {
        console.log('It is night!');
      },

      doser_on: function () {
        doser.low();
        this.set('doser', 'on');
      },

      doser_off: function () {
        doser.high();
        this.set('doser', 'off');
      },

      circ_pump_on: function () {
        circ_pump.low();
        this.set('circ_pump', 'on');
      },

      circ_pump_off: function () {
        circ_pump.high();
        this.set('circ_pump', 'off');
      },

      heater_on: function () {
        heater.low();
        this.set('heater', 'on');
      },

      heater_off: function () {
        heater.high();
        this.set('heater', 'off');
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
        if (!_.isUndefined(water_temp)) {
          this.emit('water_temperature', water_temp);

          console.log('Temperature: ' + water_temp);
        }
      },

      water_level_data: function () {
        if (!_.isUndefined(level)) {
          // HACK: do proper math.
          this.emit('water_level', level.value);

          console.log('Water level: ' + level.value);
          console.log('Water level ref: ' + level_ref.value);
        }
      },

      light_data: function () {
        if (!_.isUndefined(lux)) {
          let light_data = lux.level;

          this.emit('lux', light_data);

          console.log('Lux: ' + light_data)
        }
      },

      air_pressure_data: function () {
        if (!_.isUndefined(multi)) {
          var pressure = multi.barometer.pressure;

          this.emit('pressure', pressure);

          console.log('Pressure: ' + pressure);
        }
      },

      temp_data: function () {
        if (!_.isUndefined(multi)) {
          var temperature = multi.barometer.pressure;

          this.emit('temperature', temperature);

          console.log('Temperature: ' + temperature);
        }
      },

      hum_data: function () {
        if (!_.isUndefined(multi)) {
          var currentHumidity = multi.hygrometer.relativeHumidity;

          this.emit('humidity', currentHumidity);

          console.log('Humidity: ' + currentHumidity);
        }
      }
    })

    setTimeout(()=> {
      bioreactor.connect({
        host: 'grow.commongarden.org',
        port: 443,
        ssl: true
      });
    }, 2000)
  });
}, 3000);
