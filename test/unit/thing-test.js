import Thing from '../../lib/thing';

/*
  TODO:
  * callback?
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

  it('should emit an event when called', () => {
    var event = false;
    testThing.on('turn_light_on', () => {
      return event = true;
    });
    testThing.callAction('turn_light_on');
    expect(event).to.equal(true);
  });

  afterEach(() => {
    delete global.testThing;
  });
});
