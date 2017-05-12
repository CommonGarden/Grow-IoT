# Grow.js

[![Build Status](https://travis-ci.org/CommonGarden/Grow.js.svg?branch=development)](https://travis-ci.org/CommonGarden/Grow.js) [![Code Climate](https://codeclimate.com/github/CommonGarden/Grow.js/badges/gpa.svg)](https://codeclimate.com/github/CommonGarden/Grow.js) [![Join the chat at https://gitter.im/CommonGarden/Grow.js](https://badges.gitter.im/CommonGarden/Grow.js.svg)](https://gitter.im/CommonGarden/Grow.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Grow.js is an extension of [Thing.js](https://github.com/CommonGarden/Thing.js) with extra utilities for growers.

### Installation

`npm install Grow.js`

## Example Growfile
```javascript
// A rough GrowFile example... first draft, it's crude.
// Feel free to make suggestions though.
module.exports = {
  name: 'A plant',
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
        temperature: {
          min: 17,
          max: 28
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
```

## Usage
TODO

# Developing

Code is written in ES6, and compiled using [rollup](https://github.com/rollup/rollup).

`npm run build` builds the library.

`npm run test` builds the library, and runs tests in the test folder.

The documentation is written in jsdoc, built using [Mr-Doc](https://mr-doc.github.io/), and on the [gh-pages branch of this repo](https://github.com/CommonGarden/Grow.js/tree/gh-pages).

## License
Grow.js is released under the 2-Clause BSD License, sometimes referred to as the "Simplified BSD License" or the "FreeBSD License".
