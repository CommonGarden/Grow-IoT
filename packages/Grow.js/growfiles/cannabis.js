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
          bounds: [0,14]
        },
        ec: {
          min: 1400,
          ideal: 1500,
          max: 1700,
          bounds: [0,5000]
        },
        humidity: {
          min: 51,
          max: 61,
          bounds: [0,100]
        },
        temperature: {
          min: 17,
          max: 28,
          bounds: [-30, 50]
        },
        water_temperature: {
          min: 14,
          max: 28,
          bounds: [-20, 200]
        }
      },

      // Cycles are function that have a 'schedule' property
      cycles: {
        day: {
          schedule: 'after 6:00am',
          targets: {
            temperature: {
              ideal: 22
            }
          }
        },
        night: {
          schedule: 'after 9:00pm',
          targets: {
            temperature: {
              ideal: 18
            }
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
        temperature: {
          min: 17,
          max: 28
        }
      },

      cycles: {
        day: {
          schedule: 'after 7:00am',
          targets: {
            temperature: {
              ideal: 22
            }
          }
        },
        night: {
          schedule: 'after 7:00pm',
          targets: {
            temperature: {
              ideal: 22
            }
          }
        }
      }
    }
  }
};
