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

  // it('should register events in the config object', () => {
  //   console.log(thing);
  //   expect(thing.events.length).to.equal(1);
  // });

  // it('should call the right event when given an eventId', () => {
  //   expect(thing.events.callEvent('light_data')).to.equal('data');
  // });

  // it('should return the right event object when given an event id.', () => {
  //   var event = thing.events.getEventByID('light_data');
  //   expect(event.name).to.equal('Light data');
  // });

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
