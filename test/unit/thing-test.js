import Thing from '../../lib/thing';

/*
  TODO:
  * update property
*/

describe('Thing test', () => {
  beforeEach(() => {
    global.testThing = new Thing(thing1);
    global.testThing2 = new Thing(thing2);
  });

  it('should have cloned metadata', () => {
    expect(testThing.name).to.equal('Light');
    expect(testThing.description).to.equal('An LED light with a basic on/off api.');
  });

  describe('ACTIONS', () => {
    it('should register actions in the config object', () => {
      expect(testThing.actions.length).to.equal(3);
    });

    it('should return the right action object when given an action id.', () => {
      var action = testThing.getComponentByID('light_data');
      expect(action.name).to.equal('Light data');
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
      var component = testThing.getComponentByID('check_light_data');
      expect(component.name).to.equal('light data is data');
    });
  });

  describe('PROPERTIES', () => {
    it('should update a component property correctly', () => {
      testThing.updateComponentProperty('turn_light_on', 'schedule', 'at 9:30am')
      expect(testThing.getComponentByID('turn_light_on').schedule).to.equal('at 9:30am');
    });

    // Note: testThing 2 is experimental
    it('should return the currect property', () => {
      expect(testThing2.getProperty('lightconditions')).to.equal(null);
    });

    it('should set a property', () => {
      testThing2.setProperty('lightconditions', 'dark');
      expect(testThing2.getProperty('lightconditions')).to.equal('dark');
    });

  });

  afterEach(() => {
    delete global.testThing;
  });
});
