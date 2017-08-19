# Grow-IoT

[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/CommonGarden/Grow-IoT) [![BSD license](https://img.shields.io/badge/license-BSD--2--Clause-blue.svg)](https://github.com/CommonGarden/Grow-IoT/blob/master/LICENSE) [![Build Status](https://travis-ci.org/CommonGarden/Grow-IoT.svg?branch=master)](https://travis-ci.org/CommonGarden/Grow-IoT)

## Installing Grow-IoT

You need to install [Meteor](https://www.meteor.com/) first (if you haven't already).

Then:

```bash
git clone https://github.com/CommonGarden/Grow-IoT
cd Grow-IoT
meteor npm install
meteor
```

And that's it! Visit http://localhost:3000 with your browser of choice; you should now have the application running.


## Connecting devices (or virtual things)
Create a new device (click the '+' button) and take note of the device `uuid` and `token`. Then run (in a seperate terminal):

```bash
node tests/test-grow-hub.js
```
Paste in the `uuid` and `token` and presto! You've connected your first thing to Grow-IoT.

You can find then component for this device in `imports/examples/GrowHub.jsx`.

# Thing.js

A helper library for creating and connecting new devices.

```bash
npm install Thing.js
```

You can interact with the Grow-IoT api using the Distributed Data Protocol. *There are DDP Clients available in many different programming languages*, see http://meteorpedia.com/read/DDP_Clients for a list.

We are also slowly adding support for connecting devices over the [CoAP protocol](http://coap.technology/). See the experimental server in `imports/api/coap.js`.

### If you are a grower
Checkout Grow.js! It extends the Thing class with a bunch of useful things for growers like scheduling, registering listeners and alerts, etc.

### Usage

TODO: better example... with ui

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


### Adding custom devices components

To do so:

1. Make a new `CustomComponent.jsx` file in `imports/things/'
2. Open `imports/things/index.js`.
3. `import CustomComponent from './CustomComponent'`
4. Lastly, add `CustomComponent` to the exported `components` object.

## What's included ##

In the repo you'll find the following directories and files:

File/Folder   | Provides
--------------|----------------------------------------------------------------
`.meteor`     | Meteor stuff, well documented in other places.
`.sandstorm`  | Sandstorm.io stuff (can)
`client`      | Imports things and starts the React app.
`imports`     | API, UI, and thing examples live here
`public`      | Fonts and other static, public assets live here.
`tests`       | Unit and Thread conformance tests
`server`      | Imports the server code.
`tests`       | Hmmm....

We have a few different repos for alternative (perhaps non-Meteor) stacks:
* [Graph-QL api](https://github.com/CommonGarden/graphql-api
) and [schema](https://github.com/CommonGarden/graphql-schema)
* [Rest API](https://github.com/CommonGarden/rest-api) *(using [Express](https://expressjs.com/))*
* [Mongoose models](https://github.com/CommonGarden/mongoose-models)

Our [wiki](https://github.com/CommonGarden/Grow-IoT/wiki) also contains a growing assortment of useful info, including:
* [Cloud setup](https://github.com/CommonGarden/Grow-IoT/wiki/Cloud-setup)
* [Elastic support](https://github.com/CommonGarden/Grow-IoT/wiki/Elastic)
* [Influx support](https://github.com/CommonGarden/Grow-IoT/wiki/Influx-DB)
* [Graphana setup](https://github.com/CommonGarden/Grow-IoT/wiki/Grafana-Setup)
* [Running locally](https://github.com/CommonGarden/Grow-IoT/wiki/Running-locally)
* [Supported hardware](https://github.com/CommonGarden/Grow-IoT/wiki/Supported-hardware)

## License
Grow-IoT is released under the 2-Clause BSD License, sometimes referred to as the "Simplified BSD License" or the "FreeBSD License".

