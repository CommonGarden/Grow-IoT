var Thing = require('Grow.js');
var inquirer = require('inquirer');
var args = process.argv.slice(2);
var uuid = args[0];
var token = args[1];
var questions = [
  {
    type: 'list',
    name: 'type',
    message: 'Select Event Type',
    choices: ['temperature', 'ph', 'humidity']
  },
  {
    type: 'input',
    name: 'interval',
    message: 'Enter event interval. (in milliseconds. default: 3000ms)',
  },

]
inquirer.prompt(questions).then(function (answers) {
  const type = answers.type || 'temperature';
  const interval = answers.interval || '3000';
  console.log(`\nCreating ${type} events.`);
  var testDevice = new Thing({
    // PUT YOUR UUID AND TOKEN HERE
    uuid: uuid,
    token: token,

    component: 'test-device',

    properties: {
      state: 'off'
    },

    start: function () {
      setInterval(()=> {
        testDevice.call('temp_data');
      }, interval);
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
        type: type,
        value: temp
      });
    }
  });
  testDevice.connect();

});
