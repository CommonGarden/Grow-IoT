const Thing = require('Thing.js');
const later = require('later');
const Controller = require('node-pid-controller');
const ascii = require('ascii-codes');
const _ = require('underscore');

/**
 * Grow is an extension of a Thing (which is basically a fancy event emitter).
 * See [Thing.js](https://github.com/CommonGarden/Thing.js) for more info on Things...
 * @param {Object} config  The thing object.
 * @return {Grow}   A new Grow instance.
 */
export default class Grow extends Thing {
  constructor(config) {
    super(config);
  }

  /**
   * Creates listeners for targets objects in grow files.
   * @param {Object} targets An object contain event keys and corresponding min / max values.
   */
  registerTargets(targets) {
    this.controllers = this.controllers || {};
    this.alerts = this.alerts || {};
    this.targets = _.extend(this.targets, targets);
    _.each(targets, (value, key) => {
      if (value.ideal) {
        // Create a controller with defaults.
        // Allow for them to define control parameters?
        if (typeof value.pid === 'object') {
          try {
            this.controllers[key] = new Controller(value.pid);
          } catch (err) {
            console.log(err);
            this.controllers[key] = new Controller({
              k_p: 0.25,
              k_i: 0.01,
              k_d: 0.01,
              dt: 1
            });
          }
        }

        // Simply set the target
        this.controllers[key].setTarget(value.ideal);
      }

      this.on(key, (eventData) => {
        if (Number(eventData) !== 'NaN') {
          if (value.ideal) {
            let correction = this.controllers[key].update(eventData);
            this.emit('correction', key, correction);
          }

          if (value.min && eventData < value.min) {
            if (this.alerts[key] !== 'low') {
              let alert = {};
              alert[key] = 'low';
              _.extend(this.alerts, alert);
              this.set('alerts', this.alerts);
              this.emit('alert', alert);
            }
          }

          else if (value.max && eventData > value.max) {
            if (this.alerts[key] !== 'high') {
              let alert = {};
              alert[key] = 'high';
              _.extend(this.alerts, alert);
              this.set('alerts', this.alerts);
              this.emit('alert', alert);
            }
          }

          else {
            if (this.alerts[key]) {
              let alert = {};
              alert[key] = 'ok';
              this.emit('alert', alert);
              this.alerts = _.omit(this.alerts, key);
              this.set('alerts', this.alerts);
            }
          }
        }
      });
    });

    this.emit('targets-updated', targets);
  }

  /**
   * Remove targets
   * @param {Object} targets  Alerts to be removed.
   */
  removeTargets(targets) {
    if (_.isArray(targets)) {
      _.each(targets, (value, key) => {
        this.removeAllListeners(value);
        this.targets = _.omit(this.targets, value);
        this.controllers = _.omit(this.controllers, value)
      });
    } else if (_.isObject(targets)) {
      _.each(targets, (value, key) => {
        this.removeAllListeners(key);
        this.targets = _.omit(this.targets, key);
        this.controllers = _.omit(this.controllers, key)
      });
    } else if (typeof targets === 'string') {
      this.removeAllListeners(targets);
      this.targets = _.omit(this.targets, targets);
      this.controllers = _.omit(this.controllers, targets)
    } else {
      this.targets = {};
      this.removeAllListeners();
    }
  }


  /**
   * Start the Growfile from the first phase.
   * @param {Object} growfile  The Growfile object.
   */
  startGrow (growfile) {
    if (growfile.phases) {
      let key = _.keys(growfile.phases)[0];
      this.startPhase(key, growfile);
    } else {
      if (growfile.targets) {
        this.registerTargets(growfile.targets);
      }
      if (growfile.cycles) {
        this.parseCycles(growfile.cycles);
      }
    }
  }

  /**
   * Start a new phase, such as going from vegetative to bloom, or to 'harvest'.
   * @param {String} phaseKey  The key of the phase to start.
   * @param {Object} growfile  The Growfile object.
   */
  startPhase (phaseKey, growfile) {
    let phases = growfile.phases;
    let cycles = phases[phaseKey].cycles;
    let targets = phases[phaseKey].targets;

    this.currentPhase = phaseKey;

    try {
      if (targets) {
        this.registerTargets(targets)
      }

      if (cycles) {
        this.parseCycles(cycles);
      }
    } catch (error) {
      console.log(error);
    };
  }

  /**
   * Schedules the cycles component of a phase or simple Growfile.
   * @param {Object} cycles  An object containing cycle objects
   */
  parseCycles(cycles) {
    _.each(cycles, (list, iteratee)=> {
      let scheduledTime = later.parse.text(String(cycles[iteratee].schedule));
      return later.setTimeout(()=> {
        try {
          if (cycles[iteratee].targets) {
            this.registerTargets(cycles[iteratee].targets);
          }

          if(cycles[iteratee].options) {
            this.call(iteratee, cycles[iteratee].options);
          } else {
            this.call(iteratee);
          }
        } catch (error) {
          console.log(error);
        };
      }, scheduledTime);
    });
  }


  /**
   * Returns true if the reading falls in a valid pH range.
   * @param {Number | String} reading  The reading to check.
   * @return {Number}
   */
  static parseAtlasPH (bytes) {
    let bytelist = [];
    if (bytes[0] === 1) {
      for (let i = 0; i < bytes.length; i++) {
        if (bytes[i] !== 1 && bytes[i] !== 0) {
          bytelist.push(ascii.symbolForDecimal(bytes[i]));
        }
      }
      return Number(bytelist.join(''));
    }
  }

  /**
   * Parses EC reading from data returned from Atlas Scientific Conductivity sensor.
   * @param {String} reading  The reading to parse.
   * @return {Number}
   */
  static parseAtlasEC (bytes) {
    let bytelist = [];
    if (bytes[0] === 1) {
      for (let i = 0; i < bytes.length; i++) {
        if (bytes[i] !== 1 && bytes[i] !== 0) {
          bytelist.push(ascii.symbolForDecimal(bytes[i]));
        }
      }
      return Number(bytelist.join('').split(',')[0]);
    }
  }

  /**
   * Parses EC reading from data returned from Atlas Scientific Conductivity sensor.
   * @param {String} reading  The reading to parse.
   * @return {Number}
   */
  static parseAtlasTemperature (bytes) {
    let bytelist = [];
    if (bytes[0] === 1) {
      for (let i = 0; i < bytes.length; i++) {
        if (bytes[i] !== 1 && bytes[i] !== 0) {
          bytelist.push(ascii.symbolForDecimal(bytes[i]));
        }
      }
      return Number(bytelist.join(''));
    }
  }

  /**
   * Parses EC reading from data returned from Atlas Scientific Conductivity sensor.
   * @param {String} reading  The reading to parse.
   * @return {Number}
   */
  static parseAtlasDissolvedOxygen (bytes) {
    let bytelist = [];
    if (bytes[0] === 1) {
      for (let i = 0; i < bytes.length; i++) {
        if (bytes[i] !== 1 && bytes[i] !== 0) {
          bytelist.push(ascii.symbolForDecimal(bytes[i]));
        }
      }
      return Number(bytelist.join(''));
    }
  }
};
