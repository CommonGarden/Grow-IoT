# Thing.js

[![Build Status](https://travis-ci.org/CommonGarden/Thing.js.svg?branch=master)](https://travis-ci.org/CommonGarden/Thing.js) [![Code Climate](https://codeclimate.com/github/CommonGarden/Thing.js/badges/gpa.svg)](https://codeclimate.com/github/CommonGarden/Thing.js) [![Test Coverage](https://codeclimate.com/github/CommonGarden/Thing.js/badges/coverage.svg)](https://codeclimate.com/github/CommonGarden/Thing.js/coverage) [![Gitter](https://badges.gitter.im/CommonGarden/Thing.js.svg)](https://gitter.im/CommonGarden/Thing.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

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
```javascript
const Thing = require('Thing.js');

const Light = new Thing({
  name: 'Light',
  desription: 'An LED light with a basic on/off api.',
  username: 'jakehart',
  // These are setable and getable by the api.
  properties: {
    state: null,
  },
  start: function () {
    console.log('Thing initialized, this code runs first');
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

Light.on('turn_light_on', function() {
  console.log('Light turned on.')
});

Light.call('turn_light_on');

```

# Developing

Code is written in ES6, and compiled using [rollup](https://github.com/rollup/rollup). [Full documentation is available here](http://commongarden.github.io/Thing.js/docs/Thing.js.html).

`npm run build` builds the library.

`npm run test` builds the library, and runs tests in the test folder.

The documentation is written in jsdoc, built using [Mr-Doc](https://mr-doc.github.io/), and kept on the [gh-pages branch of this repo](https://github.com/CommonGarden/Thing.js/tree/gh-pages).