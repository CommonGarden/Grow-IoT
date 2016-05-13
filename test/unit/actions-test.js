// /* Basic tests for actions module.*/

// import Thing from '../../lib/index';

// /*
//   TODO:
//   * Test calling an action with options.
// */

// describe('Test actions', () => {
//   beforeEach(() => {
//     global.thing = new Thing(thing1);
//   });

//   it('should register actions in the config object', () => {
//     expect(thing.actions.length).to.equal(2);
//   });

//   it('should call the right action when given an actionId', () => {
//     expect(thing.callAction('turn_light_on')).to.equal('Light on.');
//   });

//   it('should return the right action object when given an action id.', () => {
//     var action = thing.actions.getActionByID('turn_light_on');
//     expect(action.name).to.equal('On');
//     expect(action.description).to.equal('Turns the light on.');
//   });


//   it('should emit an event when called', () => {
//     var event = false;
//     thing.actions.on('turn_light_on', () => {
//       return event = true;
//     });
//     thing.actions.callAction('turn_light_on');
//     expect(event).to.equal(true);
//   });

//   afterEach(() => {
//     delete global.thing;
//   });
// });
