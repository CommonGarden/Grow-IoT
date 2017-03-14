import Grow from '../lib/Grow.js';
import _ from 'underscore';
import cycles from '../examples/growfiles/cycles';
import phases from '../examples/growfiles/phases';

global.expect = require('chai').expect;

(function setup () {
  beforeEach(function() {
  	// Setup test things
    // console.log(cycles);
    // console.log(phases);
    // Grow.parsePhases(phases);
    // In the future we can test multiple different kinds of things!
  });
  afterEach(function() {
    // delete global.thing;
  });
})();

describe('Grow test', () => {
  beforeEach(() => {
    global.testThing = new Grow(phases);
  });

  it('should parse phases', () => {
    testThing.parsePhases(phases);
  });
});