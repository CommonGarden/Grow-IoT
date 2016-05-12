'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Thing = _interopDefault(require('Thing.js'));

require("source-map-support").install();
global.expect = require('chai').expect;

// require('babel/register');

(function setup() {
  beforeEach(function () {

    // Setup test things
    global.thing1 = {
      'name': 'Light',
      'description': 'An LED light with a basic on/off api.',
      'state': 'off',
      'actions': [{
        'name': 'On',
        'description': 'Turns the light on.',
        'id': 'turn_light_on',
        'updateState': 'on',
        'schedule': 'at 9:00am',
        'event': 'Light turned on',
        'function': function _function() {
          return 'Light on.';
        }
      }, {
        'name': 'off',
        'id': 'turn_light_off',
        'updateState': 'off',
        'schedule': 'at 8:30pm',
        'event': 'Light turned off',
        'function': function _function() {
          return 'Light off.';
        }
      }],
      'events': [{
        'name': 'Light data',
        'id': 'light_data',
        'type': 'light',
        'schedule': 'every 1 second',
        'function': function _function() {
          return 'data';
        }
      }]
    };
  });

  afterEach(function () {
    delete global.thing1;
  });
})();

describe('A feature test', function () {
  beforeEach(function () {
    global.testThing = new Thing(thing1);
  });

  it('should have been run once', function () {
    console.log(testThing);
    // expect(thing.constructor).to.have.been.calledOnce;
  });

  // it('should have always returned hello', () => {
  //   expect(Thing.constructor).to.have.always.returned('hello');
  // });

  afterEach(function () {
    delete global.testThing;
  });
});
//# sourceMappingURL=test-bundle.js.map