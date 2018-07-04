# Grow-IoT

[![Backers on Open Collective](https://opencollective.com/Grow-IoT/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/Grow-IoT/sponsors/badge.svg)](#sponsors) [![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/CommonGarden/Grow-IoT) [![BSD license](https://img.shields.io/badge/license-BSD--2--Clause-blue.svg)](https://github.com/CommonGarden/Grow-IoT/blob/master/LICENSE) [![Build Status](https://travis-ci.org/CommonGarden/Grow-IoT.svg?branch=development)](https://travis-ci.org/CommonGarden/Grow-IoT)

The Grow-IoT project is managed as a mono-repo with a bunch of seperately published packages such as:
* [Grow.js](https://github.com/CommonGarden/Grow-IoT/tree/development/packages/Grow.js)
* [Thing.js](https://github.com/CommonGarden/Grow-IoT/tree/development/packages/Thing.js)
* [grow-graphql-api-server](https://github.com/CommonGarden/Grow-IoT/tree/development/packages/graphql-api)
* [rest-api](https://github.com/CommonGarden/Grow-IoT/tree/development/packages/rest-api)

See our [basic Raspberry pi example](https://github.com/CommonGarden/BasicRaspberryPiExample) to get started with devices.

## Installing Grow-IoT

You need to install [Meteor](https://www.meteor.com/) first (if you haven't already). 

You will also need to install [yarn](https://yarnpkg.com/), which we use to manage all the packages that comprise Grow-IoT!

You will also need to install [yarn](https://yarnpkg.com/), which we use to manage all the packages that comprise Grow-IoT! See the [yarn website](https://yarnpkg.com/) for platform specific installation instructions.

Then clone the repo and enter the new directory:

```bash
git clone https://github.com/CommonGarden/Grow-IoT
cd Grow-IoT
```

Finally install the needed software dependencies:

```
yarn
```

Start the Grow-IoT server with the `meteor` command:

```
meteor
```

And that's it! Visit http://localhost:3000 with your browser of choice; you should now have the application running.

## Connecting devices (or virtual things)
Create a new device (click the '+' button) and create a device. Enter "test" for both the `uuid` and `token`. Then run the mock device driver (in a seperate terminal):

```bash
node packages/Grow.js/examples/test-grow-hub.js
```

You can find the ui component for this device in `imports/app/components/things/Device/Device.jsx`.

# Connecting sensors and actuators

In the `packages` directory, we've started 2 libraries to help you connect sensors and actuators and create grow systems out of them.
* [Thing.js](https://github.com/CommonGarden/Grow-IoT/tree/development/packages/Thing.js): A general purpose internet of things library... basically a fancy event emitter
* [Grow.js](https://github.com/CommonGarden/Grow-IoT/tree/development/packages/Grow.js): extends the Thing class with a bunch of useful things for growers like scheduling, registering listeners and alerts, etc.

Hardware examples live in those packages' `examples` folder. Corresponding UI components live in `imports/things/`.

**See [Thing.js](https://github.com/CommonGarden/Grow-IoT/tree/development/packages/Thing.js) for more info on creating and connecting devices.**

### Adding custom components
To do so:

1. Make a new `CustomComponent.jsx` file in `imports/things/'` or `npm install package-name` if the component is published on [npm](https://www.npmjs.com/).
2. Open `imports/app/components/things/index.js`.
3. `import CustomComponent from './CustomComponent'`
4. Lastly, add `CustomComponent` to the exported `components` object.

Example devices and grow systems:
* [Basic Raspberry Pi example](https://github.com/CommonGarden/Grow-Hub)
* [General Grow Controller](https://github.com/CommonGarden/Grow-Hub)
* [Fermenter](https://github.com/CommonGarden/Fermenter)
* [Compost Brewer](https://github.com/CommonGarden/CompostBrewer)

# Organization
In the repo you'll find the following directories and files:

File/Folder   | Provides
--------------|----------------------------------------------------------------
`.meteor`     | Meteor stuff, well documented in [other places](http://docs.meteor.com/#/full/).
`.sandstorm`  | Sandstorm.io stuff
`ai`          | AI and Machine learning code
`client`      | Imports things and starts the React app.
`docs`        | Project documentation
`imports`     | API, App, and thing web component examples live here
`packages`    | Grow.js, Thing.js, and other standalone packages live here.
`public`      | Fonts and other static, public assets live here.
`tests`       | Unit and Thread conformance tests
`server`      | Imports the server code.
`test`        | Tests

Our [wiki](https://github.com/CommonGarden/Grow-IoT/wiki) also contains a growing assortment of useful info, including:
* [Cloud setup](https://github.com/CommonGarden/Grow-IoT/wiki/Cloud-setup)
* [Elastic support](https://github.com/CommonGarden/Grow-IoT/wiki/Elastic)
* [Influx support](https://github.com/CommonGarden/Grow-IoT/wiki/Influx-DB)
* [Graphana setup](https://github.com/CommonGarden/Grow-IoT/wiki/Grafana-Setup)
* [Running locally](https://github.com/CommonGarden/Grow-IoT/wiki/Running-locally)
* [Supported hardware](https://github.com/CommonGarden/Grow-IoT/wiki/Supported-hardware)

## Roadmap

There's a lot to do.
* [Graph-QL](https://github.com/CommonGarden/Grow-IoT/issues/315)
* [MQTT](https://github.com/CommonGarden/Grow-IoT/issues/224)
* [User profiles](https://github.com/CommonGarden/Grow-IoT/issues/382)
* [Camera](https://github.com/CommonGarden/Grow-IoT/issues/374)
* [Image storage and retreival with IPFS](https://github.com/CommonGarden/Grow-IoT/issues/416)
* [Environments](https://github.com/CommonGarden/Grow-IoT/issues/311) (creating groups of things)
* [Administration and device management](https://github.com/CommonGarden/Grow-IoT/issues/370) (a green house or lab involves more than one user often)

## License
Grow-IoT is released under the 2-Clause BSD License, sometimes referred to as the "Simplified BSD License" or the "FreeBSD License".
