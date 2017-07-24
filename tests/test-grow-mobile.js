const Thing = require('Grow.js');
var inquirer = require('inquirer');
var _ = require('underscore')
const growfile = require('./tomato.js')

var args = process.argv.slice(2);
var uuid = args[0];
var token = args[1];

var questions = [
  {
    type: 'input',
    name: 'uuid',
    message: 'Enter device UUID (you are given this when you create a new thing)',
  },
  {
    type: 'input',
    name: 'token',
    message: 'Enter token',
  },
];

if(_.isUndefined(uuid) || _.isUndefined(token)) {
  inquirer.prompt(questions).then(function (answers) {
    uuid = answers.uuid;
    token = answers.token;
    createGrowHub(uuid, token);
  });
} else {
  createGrowHub(uuid, token);
}


// Create a new growHub instance and connect to https://growHub.commongarden.org
function createGrowHub(u, t) {
  const growHub = new Thing({
    uuid: u,
    token: t,
    component: 'GrowMobile',

    // Properties can be updated by the API
    properties: {
      state: 'off',
      light_state: 'off',
      fan_state: 'off',
      pump_state: 'off',
      threshold: 300,
      interval: 3000,
      currently: null,
      lightconditions: null,
      growfile: {
        phases: {
          vegetative: {
            targets: {
              ph: {
                min: 6.0,
                ideal: 6.15,
                max: 6.3,
              },
              ec: {
                min: 1400,
                ideal: 1500,
                max: 1700,
              },
              humidity: {
                min: 51,
                max: 61
              },
            },

            // You can have more cycles than just day or night.
            cycles: {
              day: {
                start: 'after 6:00am',
                targets: {
                  temperature: 24,
                  co2: {
                    min: 900,
                    max: 1600
                  }
                }
              },
              night: {
                start: 'after 9:00pm',
                targets: {
                  temperature: 20,
                  co2: {
                    min: 400,
                    max: 1000
                  },
                }
              }
            }
          },

          bloom: {
            targets: {
              ph: {
                min: 6.0,
                ideal: 6.15,
                max: 6.3,
              },
              ec: {
                min: 1400,
                ideal: 1500,
                max: 1700,
              },
              humidity: {
                min: 51,
                max: 59
              },
            },

            cycles: {
              day: {
                start: 'after 7:00am',
                targets: {
                  temperature: 24,
                }
              },
              night: {
                start: 'after 7:00pm',
                targets: {
                  temperature: 20,
                  co2: 400,
                },
              }
            }
          }
        }
      }
    },

    start: function () {
      console.log('Grow-Mobile initialized.');

      let interval = this.get('interval');

      emit_and_analyze = setInterval(()=> {
        this.temp_data();
        this.hum_data();
        this.ph_data();
        this.ec_data();
        this.lux_data();
        // this.water_temp_data();
        // this.power_data();
      }, interval);
    },

    stop: function () {
      console.log("Grow-Hub stopped.");
      clearInterval(emit_and_analyze);
      this.removeAllListeners();
    },

    day: function () {
      console.log('It is day!');
    },

    night: function () {
      console.log('It is night!');
    },

    // turn_light_on: function () {
    //   console.log('light on');
    //   this.set('light_state', 'on');
    // },

    // turn_light_off: function () {
    //   console.log('light off');
    //   this.set('light_state', 'off');
    // },

    // turn_fan_on: function () {
    //   console.log('Fan on');
    //   this.set('fan_state', 'on');
    // },

    // turn_fan_off: function () {
    //   console.log('Fan off');
    //   this.set('fan_state', 'off');
    // },

    // turn_pump_on: function () {
    //   console.log('Pump on');
    //   this.set('pump_state', 'on');
    // },

    // turn_pump_off: function () {
    //   console.log('Pump off');
    //   this.set('pump_state', 'off');
    // },

    ec_data: function () {
      eC_reading = Math.random() * 1000;

      this.emit('ec', eC_reading);

      console.log('Conductivity: ' + eC_reading);
    },

    ph_data: function () {
      pH_reading = Math.random() * 14;

      this.emit('ph', pH_reading);

      console.log('ph: ' + pH_reading);
    },

    temp_data: function () {
      let currentTemp = Math.random();

      this.emit('temperature', currentTemp);

      console.log('Temp: ' + currentTemp);
    },

    lux_data: function () {
      let lux = Math.random();

      this.emit('lux', lux);

      console.log('Lux: ' + lux);
    },

    hum_data: function () {
      let currentHumidity = Math.random();

      this.emit('humidity', currentHumidity);

      console.log("Humidity: " + currentHumidity);
    }
  }).connect();

  //  Open an image file and send it to server.
}
