const Thing = require('thing.js');
const DDPClient = require('ddp');
const EJSON = require('ddp-ejson');
const _ = require('underscore');
const http = require('http');
const url = require('url');
const coap = require('coap');
const later = require('later');
const controller = require('node-pid-controller');

/**
 * Grow is an extension of a Thing (which is basically a fancy event emitter).
 * See [Thing.js](https://github.com/CommonGarden/Thing.js) for more info on Things...
 * @param {Object} config  The thing object.
 * @return     A new grow instance.
 */
class Grow extends Thing {
  constructor(config) {
    super(config);

    this.config = config;

    this.controller = controller;

    if (!this.uuid && !this.token) {
      new Error('UUID and token are required to connect to a Grow-IoT instance.');
    }

    this._messageHandlerInstalled = false;
  }

  /**
   * Creates listeners for alerts objects in grow files.
   */
  registerAlerts(alerts) {
    _.each(alerts, (value, key) => {
      if (typeof value === 'object') {
        if (value.min) {
          this.on(key, (eventData) => {
            if (eventData.value < value.min) {
              this.emit('alert', key, 'low');
            }
          })
        }

        if (value.max){
          this.on(key, (eventData) => {
            if (eventData.value > value.max) {
              this.emit('alert', key, 'high');
            }
          })
        }
      }
    })
  }

  /**
   * Returns the current phase
   * @return     The current phase.
   */
  currentPhase () {

  }

  // Transition to a new phase, such as going from vegetative to bloom.
  transitionPhase (phase) {

  }

  /**
   * Returns the current cycle
   * @return     The current cycle.
   */
  currentCycle () {
    
  }

  /**
   * Schedules the phases component of a growfile.
   * @return     The current cycle.
   */
  parsePhases(phases) {
    _.each(phases, (phaseObject, phaseKey)=> {
      // If properties...
      let scheduledTime = later.parse.text(String(phases[phaseKey].start));
      // assign to a phase property?
      // why is their a setTimeout?
      return this.phase = later.setTimeout(()=> {
        try {
          let cycles = phases[phaseKey].cycles;

          if (cycles) {
            this.parseCycles(cycles);
          }

          if(phases[phaseKey].options) {
            this.call(iteratee, phases[phaseKey].options);
          } else {

            this.call(phaseKey);
          }
        } catch (error) {
          console.log(error);
        };
      }, scheduledTime);
    });
  }

  /**
   * Schedules the cycles component of a phase or simple growfile...
   * @return     The current cycle.
   */
  parseCycles(cycles) {
    _.each(cycles, (list, iteratee)=> {
      let scheduledTime = later.parse.text(String(cycles[iteratee].start));
      // assign to a cycle property? 
      return later.setTimeout(()=> {
        try {
          if (cycles[iteratee].targets) {
            // call registerAlerts with targets instead? so we can setup event listeners?
            
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
     * Emits event to Grow-IoT server. Adds a timestamp to the event
     * @param {Object}  event  The event to emit
     * @return  this
     */
    this.emit = (event) => {
      // The API expects a timestamped event object.
      if (typeof event === 'object') {
        event.timestamp = new Date();
        super.emit(event.type, event);
      }

      else if (typeof event === 'string') {
        super.emit(event);
        event = {
          type: event,
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
