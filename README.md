# Grow-IoT

[![Backers on Open Collective](https://opencollective.com/Grow-IoT/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/Grow-IoT/sponsors/badge.svg)](#sponsors) [![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/CommonGarden/Grow-IoT) [![BSD license](https://img.shields.io/badge/license-BSD--2--Clause-blue.svg)](https://github.com/CommonGarden/Grow-IoT/blob/master/LICENSE) [![Build Status](https://travis-ci.org/CommonGarden/Grow-IoT.svg?branch=master)](https://travis-ci.org/CommonGarden/Grow-IoT)

## Installing Grow-IoT

You need to install [Meteor](https://www.meteor.com/) first (if you haven't already). You will also need to install a version of [yarn](https://www.yarnpkg.com/) >= 1.x.

Then:

```bash
git clone https://github.com/CommonGarden/Grow-IoT
cd Grow-IoT
yarn
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

# Connecting sensors and actuators

In the `packages` directory, we've started 2 libraries to help you connect sensors and actuators and create grow systems out of them.
* [Thing.js](https://github.com/CommonGarden/Grow-IoT/tree/development/packages/Thing.js): A general purpose internet of things library... basically a fancy event emitter
* [Grow.js](https://github.com/CommonGarden/Grow-IoT/tree/development/packages/Grow.js): extends the Thing class with a bunch of useful things for growers like scheduling, registering listeners and alerts, etc.

Hardware examples live in the `.examples` folder (the folder is hidden, because Meteor is dumb and tries to build everything). The corresponding UI components live in`imports/things/`.

**See [Thing.js](https://github.com/CommonGarden/Grow-IoT/tree/development/packages/Thing.js) for more info on creating and connecting devices.**

### Adding custom devices components

To do so:

1. Make a new `CustomComponent.jsx` file in `imports/things/'
2. Open `imports/things/index.js`.
3. `import CustomComponent from './CustomComponent'`
4. Lastly, add `CustomComponent` to the exported `components` object.

## What's included

In the repo you'll find the following directories and files:

File/Folder   | Provides
--------------|----------------------------------------------------------------
`.examples`   | Hardware examples (arduino, Raspberry Pi, etc.)
`.meteor`     | Meteor stuff, well documented in other places.
`.sandstorm`  | Sandstorm.io stuff (can)
`client`      | Imports things and starts the React app.
`imports`     | API, UI, and thing examples live here
`packages`    | Grow.js and Thing.js live here.
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

# Roadmap

There's a lot to do.
* [CoAP](https://github.com/CommonGarden/Grow-IoT/issues/300) (it's been started but not tested very well)
* [Graph-QL](https://github.com/CommonGarden/Grow-IoT/issues/315)
* [User profiles](https://github.com/CommonGarden/Grow-IoT/issues/382)
* Better data visualizations (timeseries without having to use grafana anyone?)
* [Administration](https://github.com/CommonGarden/Grow-IoT/issues/370) (a green house or lab involves more than one user often)
* [Logic ui](https://github.com/CommonGarden/Grow-IoT/issues/306) (a.k.a. advanced interoperablity) a.k.a. "Swarms"
* [Environments](https://github.com/CommonGarden/Grow-IoT/issues/311) (creating groups of things)

## Contributors

This project exists thanks to all the people who contribute. [[Contribute]](CONTRIBUTING.md).
<a href="graphs/contributors"><img src="https://opencollective.com/Grow-IoT/contributors.svg?width=890" /></a>

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/Grow-IoT#backer)]

<a href="https://opencollective.com/Grow-IoT#backers" target="_blank"><img src="https://opencollective.com/Grow-IoT/backers.svg?width=890"></a>

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/Grow-IoT#sponsor)]

<a href="https://opencollective.com/Grow-IoT/sponsor/0/website" target="_blank"><img src="https://opencollective.com/Grow-IoT/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/Grow-IoT/sponsor/1/website" target="_blank"><img src="https://opencollective.com/Grow-IoT/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/Grow-IoT/sponsor/2/website" target="_blank"><img src="https://opencollective.com/Grow-IoT/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/Grow-IoT/sponsor/3/website" target="_blank"><img src="https://opencollective.com/Grow-IoT/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/Grow-IoT/sponsor/4/website" target="_blank"><img src="https://opencollective.com/Grow-IoT/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/Grow-IoT/sponsor/5/website" target="_blank"><img src="https://opencollective.com/Grow-IoT/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/Grow-IoT/sponsor/6/website" target="_blank"><img src="https://opencollective.com/Grow-IoT/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/Grow-IoT/sponsor/7/website" target="_blank"><img src="https://opencollective.com/Grow-IoT/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/Grow-IoT/sponsor/8/website" target="_blank"><img src="https://opencollective.com/Grow-IoT/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/Grow-IoT/sponsor/9/website" target="_blank"><img src="https://opencollective.com/Grow-IoT/sponsor/9/avatar.svg"></a>


## License
Grow-IoT is released under the 2-Clause BSD License, sometimes referred to as the "Simplified BSD License" or the "FreeBSD License".
