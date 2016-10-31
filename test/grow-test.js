import Grow from '../dist/Grow.umd';
import _ from 'underscore';

global.expect = require('chai').expect;

(function setup () {
  beforeEach(function() {

    // Setup test things
    // In the future we can test multiple different kinds of things!
    global.thing = {
      // Meta data
      uuid: null,
      token: null,

      // Properties can be updated by the API, Metadata cannot.
      properties: {
        name: 'Dr. Dose',
        desription: 'Dr. Dose keeps your pH balanced.',
        state: null,
        duration: 2000
      },

      start: function () {
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

  it('should have cloned metadata', () => {
    expect(testThing.thing.uuid).to.equal(null);
    expect(testThing.thing.token).to.equal(null);
  });

  describe('Methods', () => {
    it('should be able to call a thing method.', () => {
      expect(testThing.call('acid')).to.equal('acid');
    });

    it('should emit an event when a method is called', () => {
      var event = false;
      testThing.thing.on('acid', () => {
        return event = true;
      });
      testThing.call('acid');
      expect(event).to.equal(true);
    });
  });

  describe('PROPERTIES', () => {
    it('should get a thing property', () => {
      expect(testThing.get('duration')).to.equal(2000);
    });

    it('should set a property', () => {
      testThing.set('duration', 1000);
      expect(testThing.get('duration')).to.equal(1000);
    });

    it('should emit an event when a property is set', () => {
      var event = false;
      testThing.thing.on('property-updated', () => {
        return event = true;
      });
      testThing.set('duration', 5000);
      expect(testThing.get('duration')).to.equal(5000);
      expect(event).to.equal(true);
    });
  });

  afterEach(() => {
    delete global.testThing;
  });
});
