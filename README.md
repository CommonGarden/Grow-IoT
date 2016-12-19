# Grow-IoT

[![Join the chat at https://gitter.im/CommonGarden/Grow-IoT](https://badges.gitter.im/CommonGarden/Grow-IoT.svg)](https://gitter.im/CommonGarden/Grow-IoT?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Grow-IoT allows you to:
* Securely connect sensors and actuators
* Create custom things with [webcomponents](http://webcomponents.org/)
* Build a dashboard out of those components
* Own your data ([host your own instance!](https://github.com/CommonGarden/Grow-IoT/wiki/Cloud-setup))

If you think the Internet of Things should be based on open standards and interoperable by design (kind of like the web)... well, you've come to the right place.

## Installing Grow-IoT

You need to install [Meteor](https://www.meteor.com/) first (if you haven't already).

Then clone the repo, enter the new directory, and run the `build.sh` script (which installs needed [npm](https://www.npmjs.com/) and [bower](https://bower.io/) packages).

```bash
git clone https://github.com/CommonGarden/Grow-IoT
cd Grow-IoT
./build.sh
meteor
```

And that's it! Visit http://localhost:3000 with your browser of choice; you should now have the application running.

## Connecting devices (or virtual things)
Create a new device (click the '+' button) and take note of the device `uuid` and `token`. Then run (in a seperate terminal):

```bash
node tests/test-device.js
```

You can find the web component for this device in `imports/examples/test-device.html`.

**See [Grow.js](https://github.com/CommonGarden/Grow.js) for more info on connecting devices.** You can also interact with the Grow-IoT api using the Distributed Data Protocol. *There are DDP Clients available in many different programming languages*, see http://meteorpedia.com/read/DDP_Clients for a list.

## Adding components

Grow-IoT is [webcomponent](http://webcomponents.org/) based and modular. It's easy to create a new component, or add an existing one.

To add a component:

1. Install it as `./bower.sh install --save example-component`.

2. Then add it to the `imports/ui/imports.html` file.

Now it's ready to use in Grow-IoT!

Checkout [CustomElements.io](https://customelements.io/) or [Polymer's elements catalogue](https://elements.polymer-project.org/) for components to import and use in your things.

For more information on creating custom elements see the [polymer project](https://www.polymer-project.org/1.0/).

## Roadmap
We hope to be working on these things sooner rather than later:
* More examples
* Create interelationships and workflows between things (node-red style)

## License
Grow-IoT is released under the 2-Clause BSD License, sometimes referred to as the "Simplified BSD License" or the "FreeBSD License". 
