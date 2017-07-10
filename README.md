# Grow.js

[![Build Status](https://travis-ci.org/CommonGarden/Grow.js.svg?branch=development)](https://travis-ci.org/CommonGarden/Grow.js) [![Code Climate](https://codeclimate.com/github/CommonGarden/Grow.js/badges/gpa.svg)](https://codeclimate.com/github/CommonGarden/Grow.js) [![Join the chat at https://gitter.im/CommonGarden/Grow.js](https://badges.gitter.im/CommonGarden/Grow.js.svg)](https://gitter.im/CommonGarden/Grow.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Grow.js is an extension of [Thing.js](https://github.com/CommonGarden/Thing.js) with extra utilities for growers.

### Installation

`npm install Grow.js`

# Usage
See [Thing.js](https://github.com/CommonGarden/Thing.js) for more information about the Thing api which Grow.js inherits. 

This readme, covers Grow.js specific features like setting up event listeners for monitoring evnvironment data, scheduling, and parsing 'Growfiles.'

### Targets

Targets create listeners for events from sensors and emit alerts or correction events. `min`, `max`, and `ideal` are supported.

```javascript
const Grow = require('Grow.js');
const example = new Grow({});

let targets = {
  temperature: {
    min: 17,
    ideal: 22,
    max: 28,
  },
}

example.on('alert', (message)=> {
  console.log(message);
});

example.registerTargets(targets);

example.emit('temperature', {value: 10});
// { temperature: 'low' }

example.emit('temperature', {value: 30});
// { temperature: 'high' }

```

#### Built-in PID controller
If an `ideal` is specified for a target a PID controller is created and emits `correction` events. Continuing from the above example...

```javascript
    testGrow.on('corrections', (key, correction)=> {
      console.log(key);
      console.log(correction);
    });
    testGrow.emit('temperature', {value: 17});
```

You can use the correction to control heaters, dosing pumps, and more! For control over the PID controller's parameters you can pass in options under a `pid` property:

```javascript
  temperature: {
    min: 17,
    ideal: 22,
    max: 28,
    pid: {
      k_p: 1,
      k_i: 2,
      k_d: 2,
      dt: 10
    }
  },
```

### Cycles
Cycles are functions that are called at specific times in the day. Cycles require a `schedule` property which takes a valid [Later.js](https://bunkat.github.io/later/) string. When you create a grow instance, you define a method the name of the function. For example, you might implement a `day` function that turns on the lights!

Cycles are also a way of defining *moving targets*. For example, you might have a different target daytime and nighttime temperature:

```javascript
example.parseCycles({
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
        ideal: 18
      }
    }
  }
})
```

### Phases
Cycles and targets aren't enough to fully express a plant's life cycle. Phases are a way to create groups of cycles and/or targets.

A plants life cycle might be broke up into the following phases:
* Seedling
* Vegatative
* Flowering
* Harvest

There is much more work to do with regards to phases.

## Growfiles
You can combine targets, cycles, phases, and metadata into a Growfile! 

For example:

```javascript
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

# Developing

Code is written in ES6, and compiled using [rollup](https://github.com/rollup/rollup).

`npm run build` builds the library.

`npm run test` builds the library, and runs tests in the test folder.

The documentation is written in jsdoc, built using [Mr-Doc](https://mr-doc.github.io/), and on the [gh-pages branch of this repo](https://github.com/CommonGarden/Grow.js/tree/gh-pages).

## License
Grow.js is released under the 2-Clause BSD License, sometimes referred to as the "Simplified BSD License" or the "FreeBSD License".
