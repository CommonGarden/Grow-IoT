const Thing = require('../dist/Thing.umd');
const _ = require('underscore');

global.expect = require('chai').expect;

(function setup () {
  beforeEach(function() {

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
        return duration;
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


describe('Thing test', () => {
  // Do we really need a new thing every time?
  beforeEach(() => {
    global.testThing = new Thing(thing);
  });

  describe('PROPERTIES', () => {
    it('should have cloned metadata', () => {
      expect(testThing.token).to.equal(null);
      expect(testThing.uuid).to.equal(null);
    });

    it('should get a property', () => {
      expect(testThing.get('duration')).to.equal(2000);
    });

    it('should set a property', () => {
      testThing.set('duration', 3000);
      expect(testThing.get('duration')).to.equal(3000);
    });

    it('should emit an event when a property is set', () => {
      var event = false;
      testThing.on('property-updated', () => {
        return event = true;
      });
      testThing.set('duration', 5000);
      expect(testThing.get('duration')).to.equal(5000);
      expect(event).to.equal(true);
    });
  });

  describe('METHODS', () => {
    it('should be able to call a method.', () => {
      expect(testThing.call('acid')).to.equal('acid');
    });

    it('should be able to call a method with options.', () => {
      expect(testThing.call('base', 1000)).to.equal(1000);
    });


    it('should emit an event when a method is called', () => {
      var event = false;
      testThing.on('acid', () => {
        return event = true;
      });
      testThing.call('acid');
      expect(event).to.equal(true);
    });
  });

  afterEach(() => {
    delete global.testThing;
  });
});
