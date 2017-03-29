import Grow from '../lib/Grow.js';
import _ from 'underscore';
import cycles from '../examples/growfiles/cycles';
import phases from '../examples/growfiles/phases';

const expect = require('chai').expect;

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

describe('Growfile test', () => {
  beforeEach(() => {
    global.testThing = new Grow(phases);
  });

  it('should parse and schedule cycles', () => {
    testThing.parseCycles(cycles.properties.cycles);
  });

  it('should parse phases', () => {
    testThing.parsePhases(phases.properties.phases);
  });

  it('should register alert event listeners', () => {
    testThing.registerAlerts(phases.properties.phases);
  });


});