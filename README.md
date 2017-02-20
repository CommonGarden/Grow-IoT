# Thing.js

[![Build Status](https://travis-ci.org/CommonGarden/Thing.js.svg?branch=development)](https://travis-ci.org/CommonGarden/Thing.js) [![Code Climate](https://codeclimate.com/github/CommonGarden/Thing.js/badges/gpa.svg)](https://codeclimate.com/github/CommonGarden/Thing.js) [![Test Coverage](https://codeclimate.com/github/CommonGarden/Thing.js/badges/coverage.svg)](https://codeclimate.com/github/CommonGarden/Thing.js/coverage) [![Gitter](https://badges.gitter.im/CommonGarden/Thing.js.svg)](https://gitter.im/CommonGarden/Thing.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

Thing.js exports a single class 'Thing,' which is an extension of the [Node.js EventEmitter Class](https://nodejs.org/api/events.html) and basic methods for:

* Updating properties
* Calling methods
* Emiting events for either of the above.

[Full documentation available here](http://commongarden.github.io/Thing.js/docs/Thing.js.html).

For example of how this can be used in an IoT stack, checkout [Grow.js](https://github.com/CommonGarden/Grow.js).

## Install
```bash
npm install Thing.js
```

### Usage

Include `Thing.js`:
```javascript
const Thing = require('Thing.js');

```

Make a new thing and pass in an object.

```javascript

const Light = new Thing({
  // Properties can be set by the API
  properties: {
    state: null,
  },

  turn_light_on: function () {
    console.log('light on');
    Light.set('state', 'on');
  },

  turn_light_off: function () {
    console.log('light off');
    Light.set('state', 'off');
  }
});

// Things are an extension of the node EventEmitter class 
// Thus have the same API
Light.on('property-updated', function(key, value) {
  console.log('Light turned ' + value);
});

// Calling a method emits an event
Light.call('turn_light_on');
// light on
// Light turned on.

```

### Initialize
Things can optionally have an `initialize` function which runs when the thing is constructed:

```javascript
const testThing = new Thing({
  initialize: function () {
    console.log('testThing initialized');
  }
});
// testThing initialized

```

### Things as modules

If you want to make more complex things you may want to organize them into modules. Here's an example for a hypothetical `software-light.js`:

```javascript

const Thing = require('Thing.js');

module.exports = new Thing({
  metadata: 'We can include metadata like so',

  properties: {
    name: "Light"
  },

  initialize: function () {
    console.log('Light initialized');
  },

  turn_on: function () {
    console.log("Light on");
  },

  turn_off: function () {
    console.log("Light off");
  }
});
```

Then you can import them with `require()` and even use them inside other things!

```javascript
const softwareLight = require('./software-light.js');
// Light initialized

const growRoom = new Thing({
  // Optional: you may want to do this if you want the properties of 
  // softwareLight to be discoverable by Grow-IoT.
  light: softwareLight,

  initialize: function () {
    softwareLight.call('turn_on');
    this.light.call('turn_off');
  }
});
// Light on
// Light off

```

See the examples folder for more!

# Developing

Code is written in ES6, and compiled using [rollup](https://github.com/rollup/rollup). [Full documentation is available here](http://commongarden.github.io/Thing.js/docs/Thing.js.html).

`npm run build` builds the library.

`npm run test` builds the library, and runs tests in the test folder.

The documentation is written in jsdoc, built using [Mr-Doc](https://mr-doc.github.io/), and kept on the [gh-pages branch of this repo](https://github.com/CommonGarden/Thing.js/tree/gh-pages).