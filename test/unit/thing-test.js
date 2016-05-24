import Thing from '../../lib/Thing';
const _ = require('underscore');

describe('Thing test', () => {
  beforeEach(() => {
    global.testThing = new Thing(thing1);
    global.testThing2 = new Thing(thing2);
  });

  it('should have cloned metadata', () => {
    expect(testThing.name).to.equal('Light');
    expect(testThing.id).to.equal('Light');
    expect(testThing.username).to.equal('YourUsernameHere');
    expect(testThing2.name).to.equal('Light');
    expect(testThing2.id).to.equal('Light');
    expect(testThing2.username).to.equal('YourUsernameHere');
  });

  describe('ACTIONS', () => {
    it('should register actions in the config object', () => {
      expect(_.allKeys(testThing.actions).length).to.equal(3);
      expect(_.allKeys(testThing2.actions).length).to.equal(3);
    });

    it('should return the right action object when given an action id.', () => {
      var action = testThing.getAction('light_data');
      var action2 = testThing2.getAction('light_data')
      // console.log(action2);
      expect(action.name).to.equal('Log light data');
      expect(action2.name).to.equal('Log light data');
    });

    it('should be able to call a registered action.', () => {
      expect(testThing.callAction('turn_light_on')).to.equal('Light on.');
    });

    it('should emit an event when an action is called', () => {
      var event = false;
      testThing.on('turn_light_on', () => {
        return event = true;
      });
      testThing.callAction('turn_light_on');
      expect(event).to.equal(true);
    });
  });

  describe('EVENTS', () => {
    it('should register events in the config object', () => {
      expect(testThing.events.length).to.equal(2);
    });

    it('should return the right event object when given an id.', () => {
      var component = testThing.getEvent('dark');
      var component2 = testThing2.getEvent('dark');
      expect(component.name).to.equal('It\'s dark.');
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

  });

  afterEach(() => {
    delete global.testThing;
  });
});
