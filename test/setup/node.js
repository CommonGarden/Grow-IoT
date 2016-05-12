global.expect = require('chai').expect;

// require('babel/register');

(function setup () {
  beforeEach(function() {

    // Setup test things
    global.thing1 = {
      'name': 'Light',
      'description': 'An LED light with a basic on/off api.',
      'state': 'off',
      'actions': [
        {
          'name': 'On',
          'description': 'Turns the light on.',
          'id': 'turn_light_on',
          'updateState': 'on',
          'schedule': 'at 9:00am',
          'event': 'Light turned on',
          'function': function () {
            return 'Light on.';
          }
        },
        {
          'name': 'off',
          'id': 'turn_light_off',
          'updateState': 'off',
          'schedule': 'at 8:30pm',
          'event': 'Light turned off',
          'function': function () {
            return 'Light off.';
          }
        }
      ],
      'events': [
        {
          'name': 'Light data',
          'id': 'light_data',
          'type': 'light',
          'schedule': 'every 1 second',
          'function': function () {
            return 'data';
          }
        }
      ]
    };
  });

  afterEach(function() {
    delete global.thing1;
  });
})();
