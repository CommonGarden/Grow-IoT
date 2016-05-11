/* Basic tests for events module.*/

import Events from '../../src/events';

/*
  TODO:
  * Test scheduled events
*/

describe('Test events', () => {
  beforeEach(() => {
    global.events = Events.register(thing1);
  });

  it('should register events in the config object', () => {
    expect(events.events.length).to.equal(1);
  });

  it('should call the right event when given an eventId', () => {
    expect(events.callEvent('light_data')).to.equal('data');
  });

  it('should return the right event object when given an event id.', () => {
    var event = events.getEventByID('light_data');
    expect(event.name).to.equal('Light data');
  });

  afterEach(() => {
    delete global.events;
  });
});
