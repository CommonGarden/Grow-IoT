const Thing = require('Thing.js');
const later = require('later');
const Controller = require('node-pid-controller');
const ascii = require('ascii-codes');
const _ = require('underscore');
const math = require('mathjs');
const fs = require('fs');
const regression = require('regression');
const stringify = require('json-stringify-safe');
const Datastore = require('nedb');
const events = require('wildcards');

/**
 * Grow is an extension of a Thing (which is basically a fancy event emitter).
 * See [Thing.js](https://github.com/CommonGarden/Thing.js) for more info on Things...
 * @param {Object} config  The thing object.
 * @param {String} path_to_datafile  Path to db file (enables a light weight database)
 * @return {Grow}   A new Grow instance.
 */
module.exports = class Grow extends Thing {
  constructor(config, path_to_datafile) {
    super(config);

    this.buffers = {};

    // If provided with calibration data should we automatically calibrate?
    this.calibration_data = {};
    this.calibrations = {};

    // Perhaps just set these as config options? 'database' and 'state'.
    // Perhaps state should just be reserved for the Growfile?
    if (path_to_datafile) {
      this.db = new Datastore({ filename: path_to_datafile, autoload: true });
    }

    // BUG: doesn't emit sensor events...
    // if a database is configured, all events are stored in the database.
    if (this.db) {
      events(this, '*', (event, value, ...params)=>{
        console.log('%s %s %s', event, value, params);
        this.db.insert({type: event, value: value, params: params, timestamp: new Date()});
      });
    }
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
          this.controllers[key] = new Controller(value.pid);
        } else {
          this.controllers[key] = new Controller({
            k_p: 0.25,
            k_i: 0.01,
            k_d: 0.01,
            dt: 1
          });
        }

        // Simply set the target
        this.controllers[key].setTarget(value.ideal);
      }

      this.addListener(key, (eventData) => {
        if (Number(eventData) !== 'NaN') {
          if (value.ideal && eventData) {
            let correction = this.controllers[key].update(eventData);
            this.emit('correction', key, correction);
          }

          if (value.min && eventData < value.min) {
            if (this.alerts[key] !== 'low') {
              let alert = {};
              alert[key] = 'low';
              _.extend(this.alerts, alert);
              this.set('alerts', this.alerts);
              this.emit('alert', alert, eventData);
            }
          }

          else if (value.max && eventData > value.max) {
            if (this.alerts[key] !== 'high') {
              let alert = {};
              alert[key] = 'high';
              _.extend(this.alerts, alert);
              this.set('alerts', this.alerts);
              this.emit('alert', alert, eventData);
            }
          }

          else if (value.bounds) {
            if (eventData < value.bounds[0] || eventData > value.bounds[1] ) {
              if (this.alerts[key] !== 'anomaly') {
                let alert = {};
                alert[key] = 'anomaly';
                _.extend(this.alerts, alert);
                this.set('alerts', this.alerts);
                this.emit('alert', alert, eventData);
              }
            }
          }

          else {
            if (this.alerts[key]) {
              let alert = {};
              alert[key] = 'ok';
              this.emit('alert', alert);
              this.alerts = _.omit(this.alerts, key);
              this.set('alerts', this.alerts, eventData);
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
    _.each(cycles, (list, iteratee) => {
      let scheduledTime = later.parse.text(String(cycles[iteratee].schedule));
      return later.setTimeout(() => {
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
      }, scheduledTime)
    });
  }

  /**
   * Calibrates
   * @param {String} eventname  The name of the event to calibrate
   * @param {Array} calibration_data  The 'training' data
   * @param {Object} options
   * @return {Number}
   */
  calibrate (eventname, calibration_data, options) {
    // make sure calibration data of in the format of list of lists with a length of 2
    if (!this.calibrations[eventname]) {
      if (calibration_data.length >= 2 && typeof calibration_data[1] === 'object') {
        this.calibrations[eventname] = regression.linear(calibration_data, options);
      } else {
        this.calibrations[eventname] = {
          points: calibration_data,
          predict: function (value) {
            return [0, value + (calibration_data[1] - calibration_data[0])];
          }
        }
      }
    } else {
      // if it's there is only one calibration reference point
      if (typeof this.calibrations[eventname].points[1] !== 'object') {
        let points = [this.calibrations[eventname].points];
        this.calibrations[eventname].points = points;
        this.calibrations[eventname].points.push(calibration_data);
      } else {
        this.calibrations[eventname].points.push(calibration_data);
      }
    }
  }

  /**
   * Returns a calibrated value based on known values.
   * @param {String} eventname  The name of the event to calibrate
   * @param {Number} value  The value to be calibrated
   * @return {Number}
   */
  predict (eventname, value) {
    let regression = this.calibrations[eventname];
    if (regression) {
      return regression.predict(value)[1];
    } else {
      return value;
    }
  }

  /**
   * Converts readings from an analog ph sensor into pH.
   * Maybe we should pass in a temperature value too so we can acount for that?
   * @param {Number} value  The analog (0-1024) reading to convert.
   * @return {Number}
   */
  parseAnalogEC (value, options) {
    if (!this.buffers['ec']) {
      this.buffers['ec'] = [];
    }
    this.buffers['ec'].push(value);
    let bufferLength = options ? options.bufferLength: 10;
    if (this.buffers['ec'].length > bufferLength) {
      this.buffers['ec'].shift()
    }
    let VREF = options? options.VREF: 5;
    let AnalogAverage = math.median(this.buffers['ec']);
    let averageVoltage= AnalogAverage*VREF/1024.0;
    let temperature = 25.0; //when no temperature sensor ,temperature should be 25^C default
    let TempCoefficient=1.0+0.0185*(temperature-25.0); //temperature compensation formula: fFinalResult(25^C) = fFinalResult(current)/(1.0+0.0185*(fTP-25.0));
    let CoefficientVolatge = averageVoltage/TempCoefficient;
    if(CoefficientVolatge>3300) {
      // todo: emit out of bounds
      console.log('Out of the range!'); //>20ms/cm,out of the range
    }
    else{
      let ECvalue;
      ECvalue=5.3*CoefficientVolatge+2278; //10ms/cm<EC<20ms/cm
      ECvalue = ECvalue/10.0;
      return ECvalue;
    }
  }

  /**
   * Converts readings from an analog ph sensor into pH.
   * @param {Number} value  The analog (0-1024) reading to convert.
   * @return {Number}
   */
  parseAnalogpH (value, options) {
    if (!this.buffers['ph']) {
      this.buffers['ph'] = [];
    }
    this.buffers['ph'].push(value);
    let VREF = options? options.VREF: 5;
    let AnalogAverage = math.median(this.buffers['ph']);
    let averageVoltage= AnalogAverage*(VREF/1024);
    let bufferLength = options? options.bufferLength: 10;
    if (this.buffers['ph'].length > bufferLength) {
      this.buffers['ph'].shift()
    }
    return averageVoltage * 3.5;
  }

  /**
   * Parses an ascii response.
   * @param {list} response  The ascii buffer to parse.
   * @return {Number}
   */
  parseAsciiResponse (bytes) {
    let bytelist = [];
    if (bytes[0] === 1) {
      for (let i = 0; i < bytes.length; i++) {
        if (bytes[i] !== 1 && bytes[i] !== 0) {
          bytelist.push(ascii.symbolForDecimal(bytes[i]));
        }
      }
      return bytelist.join('');
    }
  }
};
