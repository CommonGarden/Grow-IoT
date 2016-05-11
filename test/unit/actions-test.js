/* Basic tests for actions module.*/

import Actions from '../../src/actions';

/*
  TODO:
  * Test calling an action with options.

*/

describe('Test actions', () => {
  beforeEach(() => {
    global.actions = Actions.register(thing1);
  });

  it('should register actions in the config object', () => {
    expect(actions.actions.length).to.equal(2);
  });

  it('should call the right action when given an actionId', () => {
    expect(actions.callAction('turn_light_on')).to.equal('Light on.');
  });

  it('should return the right action object when given an action id.', () => {
    var action = actions.getActionByID('turn_light_on');
    expect(action.name).to.equal('On');
    expect(action.description).to.equal('Turns the light on.');
  });

  afterEach(() => {
    delete global.actions;
  });
});
