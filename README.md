# Grow-IoT

[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/CommonGarden/Grow-IoT) [![BSD license](https://img.shields.io/badge/license-BSD--2--Clause-blue.svg)](https://github.com/CommonGarden/Grow-IoT/blob/master/LICENSE) [![Build Status](https://travis-ci.org/CommonGarden/Grow-IoT.svg?branch=master)](https://travis-ci.org/CommonGarden/Grow-IoT)

![screenshot](https://cloud.githubusercontent.com/assets/521978/25060230/2aec41aa-214d-11e7-9498-a05d35f733c7.jpg)

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

**See [Grow.js](https://github.com/CommonGarden/Grow.js) for more info on connecting devices such as the Raspberry Pi.**

You can interact with the Grow-IoT api using the Distributed Data Protocol. *There are DDP Clients available in many different programming languages*, see http://meteorpedia.com/read/DDP_Clients for a list.

We are also slowly adding support for connecting devices over the [CoAP protocol](http://coap.technology/). See the experimental server in `imports/api/coap.js`.

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
* [Running locally](https://github.com/CommonGarden/Grow-IoT/wiki/Running-locally)
* [Supported hardware](https://github.com/CommonGarden/Grow-IoT/wiki/Supported-hardware)

## License
Grow-IoT is released under the 2-Clause BSD License, sometimes referred to as the "Simplified BSD License" or the "FreeBSD License".

# Join the dev list

Link => https://groups.google.com/a/commongarden.org/forum/#!forum/dev
