const Thing = require('thing.js');
const DDPClient = require('ddp');
const EJSON = require('ddp-ejson');
const _ = require('underscore');
const later = require('later');
const controller = require('node-pid-controller');

/**
 * Grow is an extension of a Thing (which is basically a fancy event emitter).
 * See [Thing.js](https://github.com/CommonGarden/Thing.js) for more info on Things...
 * @param {Object} config  The thing object.
 * @return {Grow}   A new Grow instance.
 */
class Grow extends Thing {
  constructor(config) {
    super(config);

    this.config = config;

    this.controller = controller;

    this.alerts = {};

    if (!this.properties) {
      this.properties = {};
    }

    if (!this.uuid && !this.token) {
      new Error('UUID and token are required to connect to a Grow-IoT instance.');
    }

    this._messageHandlerInstalled = false;
  }

  /**
   * Creates listeners for alerts objects in grow files.
   * @param {Object} alerts An object contain event keys and corresponding min / max values.
   */
  registerAlerts(alerts) {
    _.each(alerts, (value, key) => {
      this.on(key, (eventData) => {
        if (value.min && eventData.value < value.min) {
          if (this.alerts[key] !== 'low') {
            let alert = {};
            alert[key] = 'low';
            _.extend(this.alerts, alert);
            this.set('alerts', this.alerts);
            this.emit('alert', alert);
          }
        } else if (value.max && eventData.value > value.max) {
          if (this.alerts[key] !== 'high') {
            let alert = {};
            alert[key] = 'high';
            _.extend(this.alerts, alert);
            this.set('alerts', this.alerts);
            this.emit('alert', alert);
          }
        } else if (this.alerts[key]) {
          let alert = {};
          alert[key] = 'ok';
          this.emit('alert', alert);
          this.set('alerts', this.alerts);
          this.alerts = _.omit(this.alerts, key);
        }
      })
    })
  }

  /**
   * Remove alerts
   * @param {Object} alerts  Alerts to be removed.
   */
  removeAlerts(alerts) {
    if (alerts) {
      this.alerts = _.omit(this.alerts, alerts);
      this.set('alerts', this.alerts);
      _.each(alerts, (value, key) => {
        this.removeAllListeners(key);
      });
    } else {
      this.alerts = {};
      this.set('alerts', {});
      this.removeAllListeners();
    }
  }


  /**
   * Start the Growfile from the first phase.
   * @param {Object} growfile  The Growfile object.
   */
  startGrow (growfile) {
    let key = _.keys(growfile.phases)[0];
    this.startPhase(key, growfile);
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
        this.registerAlerts(targets)
      }

      if (cycles) {
        this.parseCycles(cycles);

        if (cycles.targets) {
          this.registerAlerts(cycles.targets)
        }
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
            this.set('targets', cycles[iteratee].targets);
          }

          if(cycles[iteratee].options) {
            this.call(iteratee, cycles[iteratee].options);
          } else {
            console.log(iteratee);
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
   * @return {Boolean}
   */
  ispH (reading) {
    if (reading > 0 && reading <= 14) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Parses EC reading from data returned from Atlas Scientific Conductivity sensor.
   * @param {String} reading  The reading to parse.
   * @return {Boolean}
   */
  parseEC (reading) {
    if (typeof reading === 'string') {
      return reading.split(',')[0];
    } else {
      return false;
    }
  }

  /**
   * Average a list of readings.
   * @param {Array} listOfReadings
   * @return {Number} The average value
   */
  average (listOfReadings) {
    var average = 0;
    for (var i = listOfReadings.length - 1; i >= 0; i--) {
      if (listOfReadings[i] !== undefined && listOfReadings !== 0) {
        average += Number(listOfReadings[i]);
      }
    }

    return average / listOfReadings.length;
  }

  /**
   * Connects to Grow-IoT server over DDP. Help us support more protocols (like CoAP)! ; )
   * @param {Object}  options  Connection options
   */
  connect (options) {
    this.ddpclient = new DDPClient(_.defaults(options, {
      host: 'localhost',
      port: 3000,
      ssl: false,
      maintainCollections: false
    }));

    this.ddpclient.connect((error, wasReconnect) => {
      if (error) {
        console.log(error)
      }

      if (wasReconnect) {
        console.log('Reestablishment of a Grow server connection.');
        // Emit reconnected event?
      } else {
        console.log('Grow server connection established.');
        // Emit a connected event?
      }

      this.ddpclient.call(
        'Thing.register',
        [{uuid: this.uuid, token: this.token}, this.config],
        (error, result) => {
          if (error) {
            console.log(error);
          }

          this.afterConnect(result);
        }
      );
    });

    this.afterConnect = (result) => {
      this.ddpclient.subscribe(
        'Thing.messages',
        [{uuid: this.uuid, token: this.token}],
        (error) => {
          if (error) return console.log(error);

          if (!this._messageHandlerInstalled) {
            this._messageHandlerInstalled = true;

            this.ddpclient.on('message', (data)=> {
              data = EJSON.parse(data);

              if (data.msg !== 'added' || data.collection !== 'Things.messages') {
                return;
              }

              let command = data.fields.body;
              let opts = command.options;
              let type = command.type;
              if (type === 'setProperty') {
                this.set(opts.key, opts.value);
              } else if (opts) {
                this.call(type, opts);
              } else {
                this.call(type);
              }
            });
          }
        }
      );
    };

    /**
     * Sends an image (buffer) to the Grow-IoT server.
     * @param {Object}  
     */
    this.sendImage = (buffer) => {
      this.ddpclient.call(
        'Image.new',
        [{uuid: this.uuid, token: this.token}, buffer],
        function (error, result) {
          if (error) {
            console.log(error, result);
          }
        }
      );
    }

    /**
     * Emits event to Grow-IoT server. Adds a timestamp to the event
     * @param {Object}  event  The event to emit
     * @return  this
     */
    this.emit = (event, message) => {
      // The API expects a timestamped event object.
      if (typeof event === 'object') {
        event.timestamp = new Date();
        super.emit(event.type, event);
      }

      else if (typeof event === 'string') {
        super.emit(event, message);
        event = {
          type: event,
          message,
          timestamp: new Date()
        }
      }

      this.ddpclient.call(
        'Thing.emit',
        [{uuid: this.uuid, token: this.token}, event],
        function (error, result) {
          if (error) {
            console.log(error, result);
          }
        }
      );

      return this;
    }

    /**
     * Update thing property on thing and Grow-IoT server.
     * @param {String} key  Key of the of the property you wish to update
     * @param {Object|List|String|Number|Boolean} value The new value to set the property to.
     * @return  this
     */
    this.set = (key, value) => {
      super.set(key, value);

      if (this.ddpclient) {
        this.ddpclient.call(
          'Thing.setProperty',
          [{uuid: this.uuid, token: this.token}, key, value],
          function (error, result) {
            if (error) {
              console.log(error);
            }
          }
        );
      }

      return this;
    }
  }
};

module.exports = Grow;
