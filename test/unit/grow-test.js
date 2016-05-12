import Grow from '../../lib/index';

describe('A feature test', () => {
  beforeEach(() => {
    global.testThing = new Grow(thing1);

  });

  it('should have been run once', () => {
    // Ok we have Thing.js, now let's use it.
    console.log(testThing);
    // expect(thing.constructor).to.have.been.calledOnce;
  });

  // it('should have always returned hello', () => {
  //   expect(Thing.constructor).to.have.always.returned('hello');
  // });

  afterEach(() => {
    delete global.testThing;
  });
});
