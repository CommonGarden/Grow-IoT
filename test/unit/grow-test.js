import Grow from '../../lib/index';

/*
  Basic tests:
  * Events
*/

describe('A feature test', () => {
  it('should have setup actions correctly', () => {
    let GrowInstance = new Grow(thing1);
    expect(GrowInstance.thing.callAction('turn_light_on')).to.equal('Light on');
    expect(GrowInstance.thing.callAction('turn_light_off')).to.equal('Light off');
  });

  it('should have setup actions correctly', () => {
    let GrowInstance = new Grow(thing1);
    GrowInstance.updateActionProperty('turn_light_on', 'schedule', 'at 10:00am');
    console.log(GrowInstance);
  });

  // TODO
  // it('should have setup events correctly', () => {
  //   var GrowInstance = new Grow(thing1);
  //   // expect(thing.constructor).to.have.been.calledOnce;
  // });

});
