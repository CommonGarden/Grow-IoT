const Thing = require('../dist/Thing.umd');
const _ = require('underscore');

global.expect = require('chai').expect;

// require('babel/register');

(function setup () {
  beforeEach(function() {

    global.thing1 = {
      name: 'Light', // The display name for the thing.
      id: 'Light',
      username: 'YourUsernameHere', // The username of the account you want this device to be added to.
      properties: {
        state: 'off',
        lightconditions: function () {
          return 'unset';
        }
      },
      actions: [ // A list of action objects with ids
        {
          name: 'On', // Display name for the action
          description: 'Turns the light on.', // Optional description
          id: 'turn_light_on', // A unique id
          schedule: 'at 9:00am', // Optional scheduling using later.js
          event: 'Light turned on', // Optional event to emit when called.
          function: function () {
            // The implementation of the action.
            return 'Light on.';
          }
        },
        {
          name: 'off',
          id: 'turn_light_off',
          schedule: 'at 8:30pm',
          event: 'Light turned off',
          function: function () {
            return 'Light off.';
          }
        },
        {
          name: 'Log light data', // Events get a display name like actions
          id: 'light_data', // Events also get an id that is unique to the device
          type: 'light', // Currently need for visualization component... HACK.
          template: 'sensor',
          schedule: 'every 1 second', // Events should have a schedule option that determines how often to check for conditions.
          function: function () {
            // function should return the event to emit when it should be emited.
            return 10;
          }
        }
      ],
      events: [
        {
          name: 'It\'s dark.',
          id: 'dark',
          on: 'light_data', // Hook into an action.
          function: function () {
            return;
          }
        },
        {
          name: 'It\'s light.',
          id: 'light',
          on: 'light_data', // Hook into an action.
          function: function () {
            return;
          }
        }
      ]
    };

    global.thing2 = {
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
    delete global.thing1;
    delete global.thing2;
  });
})();


describe('Thing test', () => {
  beforeEach(() => {
    // global.testThing = new Thing(thing1);
    global.testThing2 = new Thing(thing2);
  });

  it('should have cloned metadata', () => {
    // expect(testThing.name).to.equal('Light');
    // expect(testThing.id).to.equal('Light');
    // expect(testThing.username).to.equal('YourUsernameHere');
    expect(testThing2.name).to.equal('Light');
    expect(testThing2.id).to.equal('Light');
    expect(testThing2.username).to.equal('YourUsernameHere');
  });

  describe('ACTIONS', () => {
    it('should register actions in the config object', () => {
      // expect(_.allKeys(testThing.actions).length).to.equal(3);
      expect(_.allKeys(testThing2.actions).length).to.equal(3);
    });

    it('should return the right action object when given an action id.', () => {
      // var action = testThing.getAction('light_data');
      var action2 = testThing2.getAction('light_data')
      // console.log(action2);
      // expect(action.name).to.equal('Log light data');
      expect(action2.name).to.equal('Log light data');
    });

    it('should be able to call a registered action.', () => {
      expect(testThing2.callAction('turn_light_on')).to.equal('Light on.');
    });

    it('should emit an event when an action is called', () => {
      var event = false;
      testThing2.on('turn_light_on', () => {
        return event = true;
      });
      testThing2.callAction('turn_light_on');
      expect(event).to.equal(true);
    });
  });

  describe('EVENTS', () => {
    it('should register events in the config object', () => {
      expect(_.allKeys(testThing2.events).length).to.equal(2);
    });

    it('should return the right event object when given an id.', () => {
      // var component = testThing.getEvent('dark');
      var component2 = testThing2.getEvent('dark');
      // expect(component.name).to.equal('It\'s dark.');
      expect(component2.name).to.equal('It\'s dark.');
    });
  });

  describe('PROPERTIES', () => {
    // Maybe killing this...
    // it('should update a component property correctly', () => {
    //   testThing.updateComponentProperty('turn_light_on', 'schedule', 'at 9:30am')
    //   expect(testThing.getAction('turn_light_on').schedule).to.equal('at 9:30am');
    // });

    // Note: testThing 2 has experimental support for properties
    it('should initialize correctly', () => {
      expect(testThing2.getProperty('lightconditions')).to.equal('unset');
    });

    // Note: testThing 2 has experimental support for properties
    it('should set a property', () => {
      testThing2.setProperty('lightconditions', 'dark');
      expect(testThing2.getProperty('lightconditions')).to.equal('dark');
    });

    it('should emit an event when a property is set', () => {
      var event = false;
      testThing2.on('property-updated', () => {
        return event = true;
      });
      testThing2.setProperty('lightconditions', 'light');
      expect(testThing2.getProperty('lightconditions')).to.equal('light');
      expect(event).to.equal(true);
    });

  });

  afterEach(() => {
    delete global.testThing2;
  });
});
