import Thing from 'Thing.js';

describe('A feature test', () => {
  beforeEach(() => {
    global.testThing = new Thing(thing1);

  });

  it('should have been run once', () => {
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
