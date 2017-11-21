const Grow = require('../lib/Grow.js');
const _ = require('underscore');

global.expect = require('chai').expect;

(function setup () {
  beforeEach(function() {

    global.thing = {
      // Meta data
      uuid: null,
      token: null,

      // Properties can be updated by the API, Metadata cannot.
      properties: {
        state: 'on',
        testInitialize: false,
        testStart: false,
      },

      initialize: function () {
        return this.set('testInitialize', true);
      },

      start: function () {
        return this.set('testStart', true);
      },

      testMethod: function () {
        return 'test';
      },

      testOptions: function (option) {
        return option;
      },
    }
  });

  afterEach(function() {
    delete global.thing;
  });
})();


describe('Grow.js', () => {
  beforeEach(() => {
    global.testThing = new Grow(thing);
  });

  describe('PROPERTIES', () => {
    it('should have cloned metadata', () => {
      expect(testThing.token).to.equal(null);
      expect(testThing.uuid).to.equal(null);
    });

    it('should get a property', () => {
      expect(testThing.get('state')).to.equal('on');
    });

    it('should set a property', () => {
      testThing.set('state', 'off');
      expect(testThing.get('state')).to.equal('off');
    });

    it('should emit an event when a property is set', () => {
      var event = false;
      testThing.on('property-updated', () => {
        return event = true;
      });
      testThing.set('state', 'testing');
      expect(testThing.get('state')).to.equal('testing');
      expect(event).to.equal(true);
    });
  });

  describe('METHODS', () => {
    it('should start or initialize correctly', () => {
      expect(testThing.get('testStart')).to.equal(true);
      expect(testThing.get('testInitialize')).to.equal(true);
    });

    it('should be able to call a method.', () => {
      expect(testThing.call('testMethod')).to.equal('test');
    });

    it('should contain a list of methods', () => {
      expect(testThing.functions.length).to.equal(4);
    });

    it('should be able to call a method with options.', () => {
      expect(testThing.call('testOptions', 1000)).to.equal(1000);
    });

    it('should emit an event when a method is called', () => {
      var event = false;
      testThing.on('testMethod', () => {
        return event = true;
      });
      testThing.call('testMethod');
      expect(event).to.equal(true);
    });
  });

  afterEach(() => {
    delete global.testThing;
  });
});