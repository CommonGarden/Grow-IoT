const Thing = require('Grow.js');
var inquirer = require('inquirer');
var _ = require('underscore')
const growfile = require('./grow.js')

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
  const Light = new Thing({  
    properties: {
      state: null,
    },

    start: function () {
      console.log('Thing initialized, this code runs first');

      // Things are an extension of the node EventEmitter class 
      // Thus have the same API. Here we register a listener.
      this.on('turn_light_on', function() {
        console.log('Light turned on.');
        // Calling a method emits an event
        Light.call('turn_light_on');
      });

      // Calling a method emits an event
      this.call('turn_light_on');

    },

    turn_light_on: function () {
      console.log('light on');
      Light.set('state', 'on');
    },

    turn_light_off: function () {
      console.log('light off');
      Light.set('state', 'off');
    }
  });

  const growHub = new Thing({
    uuid: u,
    token: t,
    component: 'GrowHub',

    light: Light,

    // Properties can be updated by the API
    properties: {
      state: 'off',
      threshold: 300,
      interval: 3000,
      currently: null,
      lightconditions: null,
      cycles: {
        day: {
          start: 'after 7:00am'
        },
        night: {
          start: 'after 8:00pm'
        }
      }
    },

    start: function () {
      console.log('Grow-Hub initialized.');

      let interval = this.get('interval');

      emit_and_analyze = setInterval(()=> {
        this.temp_data();
        this.hum_data();
        this.ph_data();
        this.ec_data();
        this.lux_data();
      }, interval);

      this.parseCycles(growfile.properties.cycles);
    },

    stop: function () {
      console.log("Grow-Hub stopped.");
      clearInterval(emit_and_analyze);
      this.removeAllListeners();
    },

    day: function () {
      console.log('It is day!');
      console.log(this.get('targets'))
    },

    night: function () {
      console.log('It is night!');
      console.log(this.get('targets'))
    },

    ec_data: function () {
      eC_reading = Math.random() * 1000;

      this.emit({
        type: 'ec',
        value: eC_reading
      });

      console.log('Conductivity: ' + eC_reading);
    },

    ph_data: function () {
      pH_reading = Math.random() * 14;

      this.emit({
        type: 'ph',
        value: pH_reading
      });

      console.log('ph: ' + pH_reading);
    },

    temp_data: function () {
      let currentTemp = Math.random();

      this.emit({
        type: 'temperature',
        value: currentTemp
      });

      console.log('Temp: ' + currentTemp);
    },

    lux_data: function () {
      let lux = Math.random();

      this.emit({
        type: 'lux',
        value: lux
      });

      console.log('Lux: ' + lux);
    },

    hum_data: function () {
      let currentHumidity = Math.random();
      this.emit({
        type: 'humidity',
        value: currentHumidity
      });

      console.log("Humidity: " + currentHumidity);
    }
  }).connect();

  console.log(growHub);
}
