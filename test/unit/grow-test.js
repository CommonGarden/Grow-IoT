import Grow from '../../lib/index';

describe('A feature test', () => {
  // beforeEach(() => {
  //   global.GrowInstance = new Grow(thing1);
  // });

  it('should have been run once', () => {
    // console.log(GrowInstance);
    var GrowInstance = new Grow(thing1);
    // expect(thing.constructor).to.have.been.calledOnce;
  });

  // it('should have always returned hello', () => {
  //   expect(Thing.constructor).to.have.always.returned('hello');
  // });

  afterEach(() => {
    delete global.GrowInstance;
  });
});
