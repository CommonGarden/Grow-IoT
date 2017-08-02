# Grow.js

[![Build Status](https://travis-ci.org/CommonGarden/Grow.js.svg?branch=development)](https://travis-ci.org/CommonGarden/Grow.js) [![Code Climate](https://codeclimate.com/github/CommonGarden/Grow.js/badges/gpa.svg)](https://codeclimate.com/github/CommonGarden/Grow.js) [![Join the chat at https://gitter.im/CommonGarden/Grow.js](https://badges.gitter.im/CommonGarden/Grow.js.svg)](https://gitter.im/CommonGarden/Grow.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Grow.js is an extension of [Thing.js](https://github.com/CommonGarden/Thing.js) with extra utilities for growers.

### Installation

`npm install Grow.js`

# Usage
See [Thing.js](https://github.com/CommonGarden/Thing.js) for more information about the Thing api which Grow.js inherits and for connecting to to Grow-IoT. This readme, covers Grow.js specific features like setting up event listeners for monitoring evnvironment data, scheduling, and parsing 'Growfiles.'

## Grow Files
There are three main components to a Grow file:
* [Targets](#targets)
* [Cycles](#cycles)
* [Phases](#phases)

### Targets

Targets create listeners for events from sensors and emit alerts or correction events. `min`, `max`, and `ideal` are currently supported.

```javascript
const Grow = require('Grow.js');
const example = new Grow({
  temperature: {
    min: 17,
    ideal: 22,
    max: 28,
  },
});

// Uses node event emitter api
example.on('alert', (message)=> {
  console.log(message);
});

// If a value falls below a threshhold we emit an alert
example.emit('temperature', 10);
// { temperature: 'low' }

// Likewise if it is above the threshold
example.emit('temperature', 30);
// { temperature: 'high' }

```

If an `ideal` is specified for a target a [PID controller](https://en.wikipedia.org/wiki/PID_controller) is created and emits `correction` events. Continuing from the above example...

```javascript
    testGrow.on('corrections', (key, correction)=> {
      console.log(key);
      console.log(correction);
    });
    testGrow.emit('temperature', 17);
    // temperature
    // 0.04050000000000009
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
Cycles are functions that are called at specific times in succession (for example, during the course of a day).

Cycles are also a way of defining *moving targets*. For example, you might have a different target daytime and nighttime temperature.

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

In the example above the 'day' event will be emitted after 7:00am. Various internet of things devices such as lights can listen for those events, and respond accordingly (such as turning the lights on).

### Phases
Cycles and targets aren't enough to fully express a plant's life cycle. Phases are a way to create groups of cycles and/or targets.

A plants life cycle might be broke up into the following phases:
* Seedling
* Vegatative
* Flowering
* Harvest

Each might have different environmental conditions with regards to lighting, pH, nutrients, temperature, etc.

Phases may have a `length` attribute which specifies how long they last.

In some cases may require a human to transition the grow system towards the next phase (such as transplanting seedlings, or replacing the water in the resevoir). In other words, phases may automatically or manually transition into the next phase.

## Basic example
```javascript
const Grow = require('Grow.js');

const climaterecipe = new Grow({
  "name":"Basic climate recipee",
  "description": "Metadata goes here.",
  "version":"0.1.0",
  "phases":{
    "vegetative":{
      "length": "28 days"
      "targets":{
        "ph":{
          "min":6,
          "ideal":6.15,
          "max":6.3
        },
        "ec":{
          "min":1400,
          "ideal":1500,
          "max":1700
        },
        "humidity":{
          "min":51,
          "max":61
        },
        "temperature":{
          "min":17,
          "max":28
        }
      },
      "cycles":{
        "day":{
          "schedule":"after 6:00am",
          "targets":{
            "temperature":{
              "ideal":22
            }
          }
        },
        "night":{
          "schedule":"after 9:00pm",
          "targets":{
            "temperature":{
              "ideal":18
            }
          }
        }
      }
    },
    "bloom":{
      "length": "32 days"
      "targets":{
        "ph":{
          "min":6,
          "ideal":6.15,
          "max":6.3
        },
        "ec":{
          "min":1400,
          "ideal":1500,
          "max":1700
        },
        "humidity":{
          "min":51,
          "max":59
        },
        "temperature":{
          "min":17,
          "max":28
        }
      },
      "cycles":{
        "day":{
          "schedule":"after 7:00am",
          "targets":{
            "temperature":{
              "ideal":22
            }
          }
        },
        "night":{
          "schedule":"after 7:00pm",
          "targets":{
            "temperature":{
              "ideal":22
            }
          }
        }
      }
    }
  }
});

```

Climate recipees in Grow.js are serialized as JSON, which means the same recipees can play well in JavaScript, Python, C++, and more! Interoperability and standardization are things we should strive for.

There is lot's of future work to be done! As a potential forum for working on such projects, I think a W3C community group would be great.

If you have thoughts or suggestions, I would love to hear them.

# Developing

Code is written in ES6, and compiled using [rollup](https://github.com/rollup/rollup).

`npm run build` builds the library.

`npm run test` builds the library, and runs tests in the test folder.

The documentation is written in jsdoc, built using [Mr-Doc](https://mr-doc.github.io/), and on the [gh-pages branch of this repo](https://github.com/CommonGarden/Grow.js/tree/gh-pages).

## License
Grow.js is released under the 2-Clause BSD License, sometimes referred to as the "Simplified BSD License" or the "FreeBSD License".
