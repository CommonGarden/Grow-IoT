# Grow-IoT

[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/CommonGarden/Grow-IoT) [![BSD license](https://img.shields.io/badge/license-BSD--2--Clause-blue.svg)](https://github.com/CommonGarden/Grow-IoT/blob/master/LICENSE) [![Build Status](https://travis-ci.org/CommonGarden/Grow-IoT.svg?branch=master)](https://travis-ci.org/CommonGarden/Grow-IoT)

Grow-IoT allows you to:
* Securely connect sensors and actuators
* Create custom things with [webcomponents](http://webcomponents.org/)
* Build a dashboard out of those components
* Own your data ([host your own instance!](https://github.com/CommonGarden/Grow-IoT/wiki/Cloud-setup))

If you think the Internet of Things should be based on open standards and interoperable by design (kind of like the web)... well, you've come to the right place.

## Installing Grow-IoT

You need to install [Meteor](https://www.meteor.com/) first (if you haven't already).

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
node tests/test-device.js
```
Paste in the `uuid` and `token` and presto! You've connected your first thing to Grow-IoT.

You can find the web component for this device in `imports/examples/test-device.html`.

**See [Grow.js](https://github.com/CommonGarden/Grow.js) for more info on connecting devices.** You can also interact with the Grow-IoT api using the Distributed Data Protocol. *There are DDP Clients available in many different programming languages*, see http://meteorpedia.com/read/DDP_Clients for a list. We are also slowly adding support for the [CoAP protocol](http://coap.technology/).

## License
Grow-IoT is released under the 2-Clause BSD License, sometimes referred to as the "Simplified BSD License" or the "FreeBSD License". 
