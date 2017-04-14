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
    var event = false;
    testGrow.on('alert', (key, message)=> {
      return event = !event;
    });
    testGrow.emit('temperature', {value: 10});
    expect(event).to.equal(true);
    testGrow.emit('temperature', {value: 27});
    expect(event).to.equal(false);
  });

  it('should not emit multiple alert events', () => {
    testGrow.registerAlerts({
      temperature: {
        min: 15,
        max: 25,
      }
    });
    var event = false;
    testGrow.on('alert', (key, message)=> {
      return event = !event;
    });
    testGrow.emit('temperature', {value: 10});
    testGrow.emit('temperature', {value: 10});
    expect(event).to.equal(true);
  });

  it('should emit OK alert events', () => {
    testGrow.registerAlerts({
      temperature: {
        min: 15,
        max: 25,
      }
    });
    var event = false;
    testGrow.on('alert', (alert)=> {
      return event = alert['temperature'];
    });
    testGrow.emit('temperature', {value: 10});
    testGrow.emit('temperature', {value: 15});
    expect(event).to.equal('ok');
    // Shouldn't emit multiple 'ok' events
    event = false;
    testGrow.emit('temperature', {value: 15});
    expect(event).to.equal(false);
  });


  afterEach(() => {
    delete global.testGrow;
  });

});