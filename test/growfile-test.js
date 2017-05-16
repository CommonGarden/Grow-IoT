import Grow from '../lib/Grow.js';
import _ from 'underscore';
import cycles from '../examples/growfiles/cycles';
import phases from '../examples/growfiles/phases';
import cannabis from '../examples/growfiles/cannabis';
import tomato from '../examples/growfiles/tomato';

const expect = require('chai').expect;

describe('Growfile test', () => {

  beforeEach(() => {
    global.testGrow = new Grow({});
  });

  it('should parse and schedule cycles', () => {
    testGrow.parseCycles(cycles.properties.cycles);
  });

  it('should start a simple Growfile', () => {
    testGrow.startGrow(tomato);
  });

  it('should start a Growfile with phases', () => {
    testGrow.startGrow(cannabis);
    expect(testGrow.currentPhase).to.equal('vegetative');
  });

  it('should start a phase from a Growfile', () => {
    testGrow.startPhase('bloom', cannabis);
    expect(testGrow.currentPhase).to.equal('bloom');
  });

  it('should register listeners for targets', () => {
    testGrow.registerTargets({
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
    testGrow.registerTargets({
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

  // Todo....
  it('should create a PID controller if an ideal is specified', () => {
    testGrow.registerTargets({
      temperature: {
        min: 15,
        ideal: 20,
        max: 25,
      }
    });
    expect(!!testGrow.controllers.temperature).to.equal(true);
    testGrow.on('correction', (key, correction)=> {
      console.log(key);
      console.log(correction);
    });
    testGrow.emit('temperature', {value: 17});
  });

  it('should emit OK alert events', () => {
    testGrow.registerTargets({
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

  it('should emit OK alert events even if there is a correction', () => {
    testGrow.registerTargets({
      temperature: {
        min: 15,
        ideal: 20,
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


  it('should cleanly remove targets', () => {
    testGrow.registerTargets({
      temperature: {
        min: 15,
        max: 25,
      },
      humidity: {
        min: 40,
        ideal: 50,
      },
      pH: {
        min: 5.0,
        ideal: 6.0,
        max: 7.0,
      },
    });

    testGrow.removeTargets('humidity');

    // Should remove specified target from targets object
    expect(!!testGrow.targets.humidity).to.equal(false);

    // Should remove relevant target controllers
    expect(!!testGrow.controllers.humidity).to.equal(false);

    // Should remove event listeners
    expect(testGrow._eventsCount).to.equal(2);

    testGrow.removeTargets(['temperature', 'pH']);

    expect(testGrow._eventsCount).to.equal(0);
  });


  afterEach(() => {
    delete global.testGrow;
  });

});