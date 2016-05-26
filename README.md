# Thing.js

A javascript library for working with things! Loosely inspired by [W3C web of things framework](https://github.com/w3c/web-of-things-framework), a thing is an object that has:

* Metadata
* Properties
* Actions
* Events

Thing.js exports a single class 'Thing,' which is an extension of the [Node.js EventEmitter Class](https://nodejs.org/api/events.html), and contains useful methods for:

* Updating properties
* Calling actions
* Emiting events
* Setting up event listeners
* Scheduling actions and events

[Full documentation available here](http://commongarden.github.io/Thing.js/docs/Thing.js.html).

For example of how this can be used in an IoT stack, checkout [Grow.js](https://github.com/CommonGarden/Grow.js) and [Grow-IoT](https://github.com/CommonGarden/Grow-IoT).

## Install
```bash
npm install Thing.js
```

### Example
```javascript
var Thing = require('Thing.js');

var Light = new Thing({
  name: 'Light',
  desription: 'An LED light with a basic on/off api.',
  username: 'jakehart',
  properties: {
    state: 'off',
    lightconditions: function () {
      // Properties can be updated by the API.
      // Note: property functions should return a value.
      return null;
    }
  },
  actions: {
    turn_light_on: {
      name: 'On', // Display name for the action
      description: 'Turns the light on.', // Optional description
      schedule: 'at 9:00am', // Optional scheduling using later.js
      function: function () {
        // The implementation of the action.
        console.log('light on');
        Light.setProperty('state', 'on');
      }
    },
    turn_light_off: {
      name: 'off',
      schedule: 'at 8:30pm',
      function: function () {
        console.log('light off');
        Light.setProperty('state', 'off');
      }
    },
    light_data: {
      name: 'Log light data', 
      type: 'light',
      template: 'sensor',
      schedule: 'every 1 second',
      function: function () {
         console.log("Log light data.")
      }
    }
  },
  events: {
    check_light_data: {
      name: 'Check light data',
      on: 'turn_light_on', // Adds Listener for action event.
      function: function () {
        console.log('this event listener is called when the light is turned on.');
      }
    }
  } 
}, 
function start () {
  // Optional callback function.
  return;
});

console.log(Light.getProperty(state));
// logs 'off'

Light.callAction('turn_light_on');
// logs 'Light on.'
// logs 'this event listener is called when the light is turned on.'

console.log(Light.getProperty(state));
// logs 'on'

```

Please open issues or PRs with thoughts || suggestions || proposals.

# Developing

Code is written in ES6, and compiled using [rollup](https://github.com/rollup/rollup).

`npm run build` builds the library.

`npm run test` builds the library, and runs tests in the test folder.

The documentation is written in jsdoc, built using [Mr-Doc](https://mr-doc.github.io/), and kept on the [gh-pages branch of this repo](https://github.com/CommonGarden/Thing.js/tree/gh-pages).