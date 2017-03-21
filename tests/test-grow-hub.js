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
  const growHub = new Thing({
    uuid: u,
    token: t,
    component: 'grow-hub',

    // Properties can be updated by the API
    properties: {
      state: null,
      duration: 2000,
      interval: 5000,
      targets: {},
    },

    start: function () {
      console.log('Grow-Hub initialized.');

      let interval = this.get('interval');

      emit_and_analyze = setInterval(()=> {
        this.temp_data();
        this.hum_data();
        this.ph_data();
        this.ec_data();
      }, interval);

      this.parseCycles(growfile.properties.cycles);
    },

    stop: function () {
      console.log("Grow-Hub stopped.");
      clearInterval(emit_and_analyze);
      clearInterval(light_on_timer);
      clearInterval(light_off_timer);
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

    hum_data: function () {
      let currentHumidity = Math.random();
      this.emit({
        type: 'humidity',
        value: currentHumidity
      });

      console.log("Humidity: " + currentHumidity);
    }
  }).connect();
}
// Default is localhost: 3000
// growHub.connect({
//     host: "grow.commongarden.org",
//     tlsOpts: {
//       tls: {
//         servername: "galaxy.meteor.com"
//       }
//     },
//     port: 443,
//     ssl: true
// });
