// const Grow = require('Grow.js');

// A rough GrowFile example... first draft, it's crude.
// Feel free to make suggestions though.
module.exports = {
  name: 'It goes by many names...',
  version: '0.0.1', // Not grower tested, any recommendations?
  phases: {
    vegetative: {
      // Global targets durning this phase.
      // min / max set alerts
      // ideal is the target for the phase or cycle
      targets: {
        ph: {
          min: 6.0,
          ideal: 6.15,
          max: 6.3,
        },
        ec: {
          min: 1400,
          ideal: 1500,
          max: 1700,
        },
        humidity: {
          min: 51,
          max: 61
        },
      },

      // You can have more cycles than just day or night.
      cycles: {
        water: {
          // Cycles have a start property which I will probably rename to schedule, because that's what it is.
          // Grow.js calls the corresponding function according to the schedule.
          start: 'every 2 hours'
        },
        day: {
          // Note: you may want to run the lights a little longer, adjust accordingly.
          start: 'after 6:00am',
          // You can also specify a targets property, these will be updated before the function runs. ; )
          targets: {
            temperature: 24,
            // Protip: C02 emitter should be timed in relation to exhaust fan so that C02 is not sucked out of room.
            co2: {
              min: 900,
              max: 1600
            }
          }
        },
        night: {
          start: 'after 9:00pm',
          targets: {
            temperature: 20,
            co2: {
              min: 400,
              max: 1000
            },
          }
        }
      }
    },

    bloom: {
      targets: {
        ph: {
          min: 6.0,
          ideal: 6.15,
          max: 6.3,
        },
        ec: {
          min: 1400,
          ideal: 1500,
          max: 1700,
        },
        humidity: {
          min: 51,
          max: 59
        },
      },

      cycles: {
        day: {
          start: 'after 7:00am',
          targets: {
            temperature: 24,
          }
        },
        night: {
          start: 'after 7:00pm',
          targets: {
            temperature: 20,
            co2: 400,
          },
        }
      }
    }
  }
};
