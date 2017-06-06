const Grow = require('../../lib/Grow.js');
const raspio = require('raspi-io');
const five = require('johnny-five');

// Create a new board object
const board = new five.Board({
  io: new raspio()
});

// When board emits a 'ready' event run this start function.
board.on('ready', function start() {
  // Declare needed variables.
  var emit_data;

  var multi = new five.Multi({
    controller: 'BME280'
  });

  var growHub = new Grow({
    uuid: '1b38d189-abaa-43fd-9427-be9dc9483267',
    token: '8hywifWmWgsFXYoGsu6e5yNvfFJzptmd',
    // component: 'GrowHub',

    properties: {
      light_state: null,
      duration: 2000,
      interval: 6000,
      growfile: {
        targets: {
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

      var interval = this.get('interval');

      emit_data = setInterval(()=> {
        this.temp_data();
        this.hum_data();
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

  // growHub.connect({
  //   host: '192.168.2.1',
  // });
});
