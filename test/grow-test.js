import Grow from '../dist/Grow.js';
import _ from 'underscore';

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

  describe('Calibration', () => {
    it('should calibrate based on one known value', () => {
      testThing.calibrate('ph', [6.7, 7])
      expect(testThing.predict('ph', 6.8)).to.equal(7.1);
      expect(testThing.predict('ph', 4.0)).to.equal(4.3);
      expect(testThing.predict('ph', 10.0)).to.equal(10.3);
    });

    it('should calibrate two points', () => {
      let calibration_data = [[3.7, 4], [6.7, 7]];
      testThing.calibrate('ph', calibration_data)
      expect(Number(testThing.predict('ph', 6.8))).to.equal(7.1);
    });

    it('should calibrate three points', () => {
      let calibration_data = [[3.7, 4], [6.7, 7], [9.8, 10]];
      testThing.calibrate('ph', calibration_data)
      expect(testThing.predict('ph', 6.8)).to.equal(7.06);
    });
  });

  describe('Analog Sensors', () => {
    it('should parse an analog pH value', () => {
      let ph = testThing.parseAnalogpH(467);
      expect(ph).to.equal(7.98095703125);
      // TODO: it should do so with options such as a different VREF
    });
    it('should parse an analog EC value', () => {
      let EC = testThing.parseAnalogEC(467);
      expect(EC).to.equal(229.008544921875);
      // TODO: it should do so with options such as a different VREF
    });
  });

  // TODO: get response examples to test
  describe('Atlas Scientific', () => {
    it('should be able to parse I2C response from pH sensor', () => {
      expect(testThing.parseAtlasPH([1, 255, 255, 255])).to.equal(0);
    });

    it('should be able to parse I2C response from Conductivity sensor', () => {
      expect(testThing.parseAtlasEC([1, 255, 255, 255])).to.equal(0);
      // expect(testThing.parseAtlasTDS([1, 255, 255, 255])).to.equal(0);
    });

    it('should be able to parse I2C response from Temperature probe', () => {
      expect(testThing.parseAtlasTemperature([1, 255, 255, 255])).to.equal(0);
    });

    it('should be able to parse I2C response from Dissolved Oxygen sensor', () => {
      expect(testThing.parseAtlasDissolvedOxygen([1, 255, 255, 255])).to.equal(0);
    });
  });

  afterEach(() => {
    delete global.testThing;
  });
});