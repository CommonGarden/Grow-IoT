import Grow from '../dist/Grow.umd';
import _ from 'underscore';

/*
  Basic tests:
  * Events
*/

global.expect = require('chai').expect;

(function setup () {
  beforeEach(function() {

    // Setup test things
    // In the future we can test multiple different kinds of things!
    global.thing = {
      // Meta data
      uuid: null,
      token: null,
      name: 'Dr. Dose', // The display name for the thing.
      desription: 'Dr. Dose keeps your pH balanced.',

      // Properties can be updated by the API, Metadata cannot.
      properties: {
        state: null,
        duration: 2000,
        eC_reading: null,
        pH_reading: null
      },

      start: function () {
        // Maybe emit an event instead?
        return 'Dr. Dose initialized.';
      },

      acid: function (duration) {
        return 'acid';
      },
          
      base: function (duration) {
        return 'base';
      },

      nutrient: function (duration) {
        return 'nutrient: ' + duration;
      },

      ec_data: function () {
        return 'ec_data';
      },

      ph_data: function () {
        return 'ph_data';
      }
    }
  });

  afterEach(function() {
    delete global.thing;
  });
})();


describe('Grow test', () => {
  beforeEach(() => {
    global.testThing = new Grow(thing);
  });

  // it('should have cloned metadata', () => {
  //   expect(testThing.uuid).to.equal(null);
  //   expect(testThing.token).to.equal(null);
  // });

  // describe('ACTIONS', () => {
  //   it('should be able to call a registered action.', () => {
  //     expect(testThing.call('turn_light_on')).to.equal('Light on.');
  //   });

  //   it('should get an action property', () => {
  //     expect(testThing.get('name', 'turn_light_on')).to.equal('On');
  //   });

  //   it('should set an action property', () => {
  //     testThing.set('name', 'Robert', 'turn_light_on');
  //     expect(testThing.get('name', 'turn_light_on')).to.equal('Robert');
  //   });

  //   it('should emit an event when an action is called', () => {
  //     var event = false;
  //     testThing.thing.on('turn_light_on', () => {
  //       return event = true;
  //     });
  //     testThing.call('turn_light_on');
  //     expect(event).to.equal(true);
  //   });
  // });

  // describe('EVENTS', () => {
  //   it('should register events in the config object', () => {
  //     expect(_.allKeys(testThing.thing.events).length).to.equal(2);
  //   });

  //   it('should get an event property', () => {
  //     expect(testThing.get('name', 'dark')).to.equal('It\'s dark.');
  //   });

  //   it('should set an event property', () => {
  //     testThing.set('name', 'Robert', 'dark');
  //     expect(testThing.get('name', 'dark')).to.equal('Robert');
  //   });
  // });

  // describe('PROPERTIES', () => {
  //   it('should initialize correctly', () => {
  //     expect(testThing.get('lightconditions')).to.equal('unset');
  //   });

  //   it('should set a property', () => {
  //     testThing.set('lightconditions', 'dark');
  //     expect(testThing.get('lightconditions')).to.equal('dark');
  //   });

  //   it('should emit an event when a property is set', () => {
  //     var event = false;
  //     testThing.thing.on('property-updated', () => {
  //       return event = true;
  //     });
  //     testThing.set('lightconditions', 'light');
  //     expect(testThing.get('lightconditions')).to.equal('light');
  //     expect(event).to.equal(true);
  //   });
  // });

  afterEach(() => {
    delete global.testThing;
  });
});
