import Grow from '../dist/Grow.umd';
import _ from 'underscore';

/*
  Basic tests:
  * Events
*/

global.expect = require('chai').expect;

(function setup () {
  beforeEach(function() {

    // Setup test things
    // In the future we can test multiple different kinds of things!
    global.thing = {
      uuid: '3ed775b6-177c-48e4-a977-84d21e2c6189',
      token: 'Gizt4yHPAiRHZwRbcomyeZhpagPFyQgQ',
      name: 'Light',
      id: 'Light',
      properties: {
        state: 'off',
        lightconditions: function () {
          return 'unset';
        }
      },
      actions: {
        turn_light_on: {
          name: 'On',
          description: 'Turns the light on.',
          schedule: 'at 9:00am',
          event: 'Light turned on',
          function: function () {
            return 'Light on.';
          }
        },
        turn_light_off: {
          name: 'off',
          schedule: 'at 8:30pm',
          event: 'Light turned off',
          function: function () {
            return 'Light off.';
          }
        },
        light_data: {
          name: 'Log light data',
          type: 'light',
          template: 'sensor',
          schedule: 'every 1 second',
          function: function () {
            return 10;
          }
        }
      },
      events: {
        dark: {
          name: 'It\'s dark.',
          on: 'light_data',
          function: function () {
            return;
          }
        },
        light: {
          name: 'It\'s light.',
          on: 'light_data',
          function: function () {
            return;
          }
        }
      }
    }
  });

  afterEach(function() {
    delete global.thing;
  });
})();


describe('Grow test', () => {
  beforeEach(() => {
    global.testThing = new Grow(thing);
  });

  it('should have cloned metadata', () => {
    expect(testThing.thing.name).to.equal('Light');
    expect(testThing.thing.id).to.equal('Light');
    expect(testThing.thing.username).to.equal('YourUsernameHere');
  });

  // describe('STATE', () => {
  //   // TODO
  //   it('should load correctly from state', () => {
  //     expect(false).to.equal(true);
  //   });
  // });

  describe('ACTIONS', () => {
    it('should be able to call a registered action.', () => {
      expect(testThing.call('turn_light_on')).to.equal('Light on.');
    });

    it('should get an action property', () => {
      expect(testThing.get('name', 'turn_light_on')).to.equal('On');
    });

    it('should set an action property', () => {
      testThing.set('name', 'Robert', 'turn_light_on');
      expect(testThing.get('name', 'turn_light_on')).to.equal('Robert');
    });

    it('should emit an event when an action is called', () => {
      var event = false;
      testThing.thing.on('turn_light_on', () => {
        return event = true;
      });
      testThing.call('turn_light_on');
      expect(event).to.equal(true);
    });
  });

  describe('EVENTS', () => {
    it('should register events in the config object', () => {
      expect(_.allKeys(testThing.thing.events).length).to.equal(2);
    });

    it('should get an event property', () => {
      expect(testThing.get('name', 'dark')).to.equal('It\'s dark.');
    });

    it('should set an event property', () => {
      testThing.set('name', 'Robert', 'dark');
      expect(testThing.get('name', 'dark')).to.equal('Robert');
    });
  });

  describe('PROPERTIES', () => {
    it('should initialize correctly', () => {
      expect(testThing.get('lightconditions')).to.equal('unset');
    });

    it('should set a property', () => {
      testThing.set('lightconditions', 'dark');
      expect(testThing.get('lightconditions')).to.equal('dark');
    });

    it('should emit an event when a property is set', () => {
      var event = false;
      testThing.thing.on('property-updated', () => {
        return event = true;
      });
      testThing.set('lightconditions', 'light');
      expect(testThing.get('lightconditions')).to.equal('light');
      expect(event).to.equal(true);
    });
  });

  afterEach(() => {
    delete global.testThing;
  });
});
