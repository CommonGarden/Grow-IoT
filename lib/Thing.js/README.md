# Thing.js

[![Build Status](https://travis-ci.org/CommonGarden/Thing.js.svg?branch=development)](https://travis-ci.org/CommonGarden/Thing.js) [![Code Climate](https://codeclimate.com/github/CommonGarden/Thing.js/badges/gpa.svg)](https://codeclimate.com/github/CommonGarden/Thing.js) [![Gitter](https://badges.gitter.im/CommonGarden/Thing.js.svg)](https://gitter.im/CommonGarden/Thing.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

Thing.js exports a single class 'Thing,' which is an extension of the [Node.js EventEmitter Class](https://nodejs.org/api/events.html) and basic methods for:

* Updating properties
* Calling methods
* Emiting events for either of the above.

[Full documentation available here](http://commongarden.github.io/Thing.js/docs/thing.js.html).

For example of how this can be used in an IoT stack, checkout [Grow.js](https://github.com/CommonGarden/Grow.js) or the [thing.js CoAP branch](https://github.com/CommonGarden/Thing.js/tree/coap).

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
Things can optionally have an `initialize`  or `start` function which runs when the thing is constructed:

```javascript
const testThing = new Thing({
  initialize: function () {
    console.log('testThing initialized');
  }
});
// testThing initialized

```

### Connection options

The connect method takes a configuration object.

The `host` property is where the device will connect to a Grow-IoT instance. By default the `host` is set to `localhost` and the port is set to Meteor's standard of `3000`. This works nicely for usb devices like Arduino.

For connecting over wifi, connect your device to wifi and set the `host` to the IP address where the Grow-IoT instance is running. Pass the options to the `connect()` method like so:

```javascript
grow.connect({
    "host": "YOUR_IP_HERE"
})
```

#### Connecting over SSL
You can connect securely to our Grow-IoT alpha instance on https://grow.commongarden.org, or see the [Grow-IoT repo](https://github.com/CommonGarden/Grow-IoT) to easily start your own IoT network locally or hosted on [Meteor Galaxy](https://galaxy.meteor.com).

SSL is supported though will require a bit more setup. If you are hosting your instance off a computer with a dedicated IP address pass the following the `connect()` method.

```javascript
grow.connect({
    "host": "YOUR_IP_HERE",
    "port": 443,
    "ssl": true
})
```

If you are hosting on a cloud instance such as [Meteor Galaxy](https://galaxy.meteor.com), you might need specify the servername. The example below shows you how to connect securely to the instance at [grow.commongarden.org](https://grow.commongarden.org):

```javascript
grow.connect({
    "host": "grow.commongarden.org",
    "tlsOpts": {
        "tls": {
            "servername": "galaxy.meteor.com"
        }
    },
    "port": 443,
    "ssl": true
});
```

### Connect to Grow-IoT Instance

In Grow-IoT, create a new device and take note of the device `uuid` and `token`.

In the `examples` folder checkout `test-device.js`. If you want to get started straight away with hardware, skip to the [working with hardware](#working-with-hardware) section.

Replace the `uuid` and `token` properties of the config object with the credentials you generate.

```javascript
// Import the latest build of the Grow.js library
var Thing = require('Grow.js');

// Create a new grow instance. Connects by default to localhost:3000
var testDevice = new Thing({
    // PUT YOUR UUID AND TOKEN HERE:
    uuid: 'PASTE_UUID_HERE',
    token: 'PASTE_TOKEN_HERE',

    // Specifies the component associated with the thing
    component: 'TestDevice',

    // Properties can be updated by the API
    properties: {
        state: 'off',
    },

    turn_on: function () {
        testDevice.set('state', 'on');
    },

    turn_off: function () {
        testDevice.set('state', 'off');
    },
});

// Connects to localhost:3000 by default.
testDevice.connect();

```

Run it with:
```bash
node examples/test-device.js
```

# Working with hardware.

Grow.js works very well with the [Johnny-Five robotics library](http://johnny-five.io/), which has plugins for [a large number of devices](http://johnny-five.io/#platform-support). 

Note, with boards like the Tessel 2, Johnny-five is not required, but we're including it to make it easier to get started and support a wide variety of devices, sensors, and actuators.

### Wire up photo-resitor and led to arduino
Wire up your photo resistor and LED light like so:

![Wiring diagram](https://raw.githubusercontent.com/CommonGarden/Grow.js/master/examples/arduino/smart-light/Arduino-night-light-circuit.png)

To use [Johnny-Five](http://johnny-five.io/), you need to make sure that your arduino is flashed with Standard Firmata. Instructions for doing so can be found [here](https://github.com/rwaldron/johnny-five/wiki/Getting-Started#trouble-shooting). Once that's done you're ready for the next step!

Take a look at the `smart-light` example in the `examples/arduino/` folder.

Create a new thing in the Grow-IoT ui and copy and paste the UUID and Token into the example below.

```javascript
// Require the Grow.js build and johnny-five library.
var Thing = require('Grow.js');
var five = require('johnny-five');

// See http://johnny-five.io/ to connect devices besides arduino.
var board = new five.Board();

var emit_and_analyze;

// When board emits a 'ready' event run this start function.
board.on('ready', function start() {
    // Define variables
    var LED = new five.Pin(13),
        lightSensor = new five.Sensor('A0');

    // Create a new thing.
    var light = new Thing({
        uuid: 'PASTE_UUID_HERE',
        token: 'PASTE_TOKEN_HERE',

        component: 'SmartLight',

        properties: {
            state: 'off',
            threshold: 300,
            interval: 1000,
            lightconditions: null
        },

        start: function () {
            var interval = this.get('interval');
            
            emit_and_analyze = setInterval(function () {
                light.call('light_data');
                light.call('check_light_data');
            }, interval);

            // Todo: implement clear interval function so we can adjust
            // the rate at which data is logged.
        },

        stop: function () {
            clearInterval(emit_and_analyze);
        },

        turn_on: function () {
            LED.high();
            light.set('state', 'on');
            console.log('light on');
        },

        turn_off:  function () {
            LED.low();
            light.set('state', 'off');
            console.log('light off')
        },

        light_data: function () {
            console.log(lightSensor.value);

            light.emit({
              type: 'light',
              value: lightSensor.value
            });
        },

        check_light_data: function () {
            var threshold = light.get('threshold');
            if ((lightSensor.value < threshold) && (light.get('lightconditions') != 'dark')) {
                light.set('lightconditions', 'dark');
            } else if ((lightSensor.value >= threshold) && (light.get('lightconditions') != 'light')) {
                light.set('lightconditions', 'light');
            }
        }
    });

    light.connect();
});

```

Run `smart-light.js` with:

```bash
node examples/arduino/smart-light/smart-light.js
```

Note: on certain opperating systems you may need to prefix that command with `sudo` to allow the script access to USB.

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