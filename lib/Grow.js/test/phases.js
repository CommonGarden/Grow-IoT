module.exports = {
  properties: {
    name: 'Grow File example',
    version: '0.1.5',
      
    targets: {
      temperature: {
        min: 17,
        max: 25
      },
      ph: {
        min: 5.7,
        max: 6.5
      },
      humidity: {
        min: 40,
        max: 65
      },
    },

    phases: {
      description: 'In the vegatative phase',
      vegetative: {
        cycles: {
          day: {
            schedule: 'after 6:00am',
            targets: {
              temperature: 24,
              co2: {
                min: 900,
                max: 1600
              }
            }
          },
          night: {
            schedule: 'after 9:00pm',
            targets: {
              temperature: 20,
            }
          }
        }
      },

      bloom: {
        cycles: {
          day: {
            schedule: 'after 7:00am',
            targets: {
              temperature: 24
            }
          },
          night: {
            schedule: 'after 7:00pm',
            targets: {
              temperature: 20,
              co2: 400
            }
          }
        }
      }
    }
  }
}
