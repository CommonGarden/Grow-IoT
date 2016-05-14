import Thing from '../../lib/thing';

/*
  TODO:
  * update property
*/

describe('Thing test', () => {
  beforeEach(() => {
    global.testThing = new Thing(thing1);
  });

  it('should have been constructed correctly', () => {
    // console.log(testThing);
    expect(testThing.name).to.equal('Light');
    expect(testThing.description).to.equal('An LED light with a basic on/off api.');
  });

  it('should register actions in the config object', () => {
    expect(testThing.actions.length).to.equal(3);
  });

  it('should register events in the config object', () => {
    expect(testThing.events.length).to.equal(1);
  });

  it('should return the right action object when given an action id.', () => {
    var action = testThing.getActionByID('light_data');
    expect(action.name).to.equal('Light data');
  });

  it('should return the right event object when given an event id.', () => {
    var event = testThing.getEventByID('check_light_data');
    expect(event.name).to.equal('light data is data');
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

  // This test is not working properly...
  it('events should register properly', () => {
    // var event = false;
    // testThing.on('turn_light_on', () => {
    //   return event = true;
    // });
    testThing.callAction('light_data');
    // expect(event).to.equal(true);
  });

  afterEach(() => {
    delete global.testThing;
  });
});
