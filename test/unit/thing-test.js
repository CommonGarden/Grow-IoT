import Thing from '../../lib/index';

/*
  TODO:
  * callback?
  * update property
*/

describe('A feature test', () => {
  beforeEach(() => {
    global.testThing = new Thing(thing1);
  });

  it('should have been constructed correctly', () => {
    console.log(testThing);
    expect(testThing.name).to.equal('Light');
    expect(testThing.description).to.equal('An LED light with a basic on/off api.');
  });

  it('should be able to call a registered action.', () => {
    expect(testThing.actions.callAction('turn_light_on')).to.equal('Light on.');
  });

  afterEach(() => {
    delete global.testThing;
  });
});
