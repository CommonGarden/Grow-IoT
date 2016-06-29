const Thing = require('../dist/Thing.umd');
const _ = require('underscore');

global.expect = require('chai').expect;

(function setup () {
  beforeEach(function() {

    global.thing = {
      name: 'Light', // The display name for the thing.
      id: 'Light',
      username: 'YourUsernameHere', // The username of the account you want this device to be added to.
      properties: { // These can be updated by the API.
        state: 'off',
        lightconditions: function () {
          return 'unset';
        }
      },
      actions: { // a list of action objects with keys
        turn_light_on: {
          name: 'On', // Display name for the action
          description: 'Turns the light on.', // Optional description
          schedule: 'at 9:00am', // Optional scheduling using later.js
          event: 'Light turned on', // Optional event to emit when called.
          function: function () {
            // The implementation of the action.
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
          name: 'Log light data', // Events get a display name like actions
          type: 'light', // Currently need for visualization component... HACK.
          template: 'sensor',
          schedule: 'every 1 second', // Events should have a schedule option that determines how often to check for conditions.
          function: function () {
            return 10;
          }
        }
      },
      events: {
        dark: {
          name: 'It\'s dark.',
          on: 'light_data', // Hook into an action.
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


describe('Thing test', () => {
  beforeEach(() => {
    global.testThing = new Thing(thing);
  });

  it('should have cloned metadata', () => {
    expect(testThing.name).to.equal('Light');
    expect(testThing.id).to.equal('Light');
    expect(testThing.username).to.equal('YourUsernameHere');
  });

  describe('ACTIONS', () => {
    it('should register actions in the config object', () => {
      expect(_.allKeys(testThing.actions).length).to.equal(3);
    });

    it('should return the right action object when given an action id.', () => {
      var action = testThing.getAction('light_data')
      expect(action.name).to.equal('Log light data');
    });

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
      testThing.on('turn_light_on', () => {
        return event = true;
      });
      testThing.call('turn_light_on');
      expect(event).to.equal(true);
    });
  });

  describe('EVENTS', () => {
    it('should register events in the config object', () => {
      expect(_.allKeys(testThing.events).length).to.equal(2);
    });

    it('should get an event property', () => {
      expect(testThing.get('name', 'dark')).to.equal('It\'s dark.');
    });

    it('should set an event property', () => {
      testThing.set('name', 'Robert', 'dark');
      expect(testThing.get('name', 'dark')).to.equal('Robert');
    });

    it('should return the right event object when given an id.', () => {
      var component = testThing.getEvent('dark');
      expect(component.name).to.equal('It\'s dark.');
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
      testThing.on('property-updated', () => {
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
