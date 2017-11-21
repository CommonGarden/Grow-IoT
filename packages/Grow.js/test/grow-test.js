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

  describe('State', () => {
    it('should write state to file', () => {
      let statefulThing = new Grow(thing, 'state.json')
      // TODO: it should do so with options such as a different VREF
    });
  });

  describe('Calibration', () => {
    it('should calibrate based on one measured value and a known value', () => {
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

    it('should create new calibration data', () => {
      testThing.calibrate('ph', [6.7, 7.0])
      expect(testThing.predict('ph', 6.8)).to.equal(7.1);
      testThing.calibrate('ph', [3, 4])
      expect(testThing.predict('ph', 6.8)).to.equal(7.1);
    });

    it('should add to existing calibration data', () => {
      testThing.calibrate('ph', [3.7, 4]);
      expect(testThing.predict('ph', 6.8)).to.equal(7.1);
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
  describe('Utilities', () => {
    it('should be able to parse ASCII response', () => {
      expect(testThing.parseAsciiResponse([1, 255, 255, 255])).to.equal('');
    });
  });

  afterEach(() => {
    delete global.testThing;
  });
});