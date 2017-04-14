import Grow from '../lib/Grow.js';
import _ from 'underscore';
import cycles from '../examples/growfiles/cycles';
import phases from '../examples/growfiles/phases';
import cannabis from '../examples/growfiles/cannabis';

const expect = require('chai').expect;

describe('Growfile test', () => {

  beforeEach(() => {
    global.testGrow = new Grow({});
  });

  it('should parse and schedule cycles', () => {
    testGrow.parseCycles(cycles.properties.cycles);
  });

  it('should start a Growfile', () => {
    testGrow.startGrow(cannabis);
  });

  it('should start a phase from a Growfile', () => {
    testGrow.startPhase('bloom', cannabis);
  });

  it('should register alert event listeners', () => {
    testGrow.registerAlerts({
      temperature: {
        min: 15,
        max: 25,
      }
    });
    testGrow.emit('temperature', {value: 10});
    testGrow.on('alert', (key, message)=> {
      console.log(key);
      console.log(message);
    });
  });

  afterEach(() => {
    delete global.testGrow;
  });

});