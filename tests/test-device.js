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
    component: 'TestDevice',

    properties: {
      state: 'off',
      interval: 3000
    },

    start: function () {
      setInterval(()=> {
        testDevice.call('temp_data');
      }, this.get('interval'));
    },

    turn_on: function () {
      console.log('on');
      testDevice.set('state', 'on');
    },

    turn_off: function () {
      console.log('off');
      testDevice.set('state', 'off');
    },

    temp_data: function () {
      let temp = Math.random() * 100;

      console.log(temp);

      testDevice.emit({
        type: 'temperature',
        value: temp
      });
    }
  });

  testDevice.connect();
}
