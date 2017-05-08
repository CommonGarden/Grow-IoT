var Thing = require('Grow.js');
var inquirer = require('inquirer');
var _ = require('underscore')

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
    testDevice(uuid, token);
  });
} else {
  testDevice(uuid, token);
}

function testDevice (u, t) {
  var testDevice = new Thing({
    // PUT YOUR UUID AND TOKEN HERE OR SUPPLY THEM AS ARGUMENTS
    uuid: u,
    token: t,
    component: 'TentacleExample',

    properties: {
      interval: 3000,
      growfile: {
      	ph: {
      		min: 4.0,
      		max: 7.0,
      	},
      	ec: {
      		min: 700,
      		max: 1400,
      	},
      	water_temperature: {
      		min: 14,
      		max: 20,
      	}
      }
    },

    start: function () {
      setInterval(()=> {
        testDevice.data();
      }, this.get('interval'));

      let growfile = {};
      growfile.targets = this.get('growfile');
      this.startGrow(growfile);
      console.log(this);
    },

    restart: function () {
      let targets = this.get('growfile');
      this.removeTargets(targets);
      console.log(this);
      this.start();
    },

    data: function () {
      let temp = Math.random() * 32;
      let ph = Math.random() * 14;
      let conductivity = Math.random() * 1000;

      testDevice.emit({
        type: 'water_temperature',
        value: temp
      });

      testDevice.emit({
        type: 'ec',
        value: conductivity
      });

      testDevice.emit({
        type: 'ph',
        value: ph
      });
    }
  });

  testDevice.connect();
}
