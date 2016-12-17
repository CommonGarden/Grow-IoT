# Grow-IoT

[![Join the chat at https://gitter.im/CommonGarden/Grow-IoT](https://badges.gitter.im/CommonGarden/Grow-IoT.svg)](https://gitter.im/CommonGarden/Grow-IoT?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Grow-IoT allows you to currently:
* Create custom devices / things with webcomponents #usetheplatform
* Securely connect sensors and actuators ([Grow.js](https://github.com/CommonGarden/Grow.js) is there to help)
* Build a dashboard out of those components
* Own your data ([host your own instance!](https://github.com/CommonGarden/Grow-IoT/wiki/Cloud-setup))

We hope to be working on these things sooner rather than later:
* Support for existing hardware
* Create interelationships and workflows between things (node-red style)
* Support for more protocols like CoAP and MQTT
* RESTful API

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
Create a new device (click the '+' button) and take note of the device `uuid` and `token`.

In the `tests` folder checkout `test-device.js`. **Replace the `uuid` and `token` properties of the config object with the credentials you generate.**

```javascript
// Import the latest build of the Grow.js library
var Thing = require('Grow.js');

// Create a new grow instance. Connects by default to localhost:3000
var testDevice = new Thing({
    // ADD API CREDENTIALS
    uuid: 'PASTE_UUID_HERE',
    token: 'PASTE_TOKEN_HERE',
    
    // Specifies the web component associated with the thing
    component: 'test-device',

    // Properties can be updated by the API
    properties: {
        state: 'off'
    },

    start: function () {
        setInterval(()=> {
            testDevice.call('temp_data');
        }, 3000);
    },

    turn_on: function () {
        testDevice.set('state', 'on');
    },

    turn_off: function () {
        testDevice.set('state', 'off');
    },

    temp_data: function () {
        let temp = Math.random() * 100;

        // Send data to the Grow-IoT app.
        testDevice.emit({
          type: 'temperature',
          value: temp
        });
    }
});

// Connects by default to localhost:300
testDevice.connect();

```

After you add the `uuid` and `token` to the thing and have Grow-IoT running locally run (in a seperate terminal):

```bash
node tests/test-device.js
```

You can find the web component for this device in the `imports/examples` folder. 

See [Grow.js](https://github.com/CommonGarden/Grow.js) for more info on connecting devices. You can also interact with the Grow-IoT api using the Distributed Data Protocol. *There are DDP Clients available in many different programming languages*, see http://meteorpedia.com/read/DDP_Clients for a list.

## Adding components

Grow-IoT is [webcomponent](http://webcomponents.org/) based and modular. It's easy to create a new component, or add an existing one.

To add a component:

1. Install it as `./bower.sh install --save example-component`.

2. Then add it to the `imports/ui/imports.html` file.

Now it's ready to use in Grow-IoT!

Checkout [CustomElements.io](https://customelements.io/) or [Polymer's elements catalogue](https://elements.polymer-project.org/) for components to import and use in your things.

For more information on creating custom elements see the [polymer project](https://www.polymer-project.org/1.0/).

## Contributing
Be kind to one another. All are welcome. See the following for more info:

* [Code of Conduct](https://github.com/CommonGarden/Organization/blob/master/code-of-conduct.md)
* [Contributing Info](https://github.com/CommonGarden/Organization/blob/master/contributing.md)

### Code Style
For now, we are sticking closely to what's documented in the Meteor guide. Take a look at the following for more info and helpful examples:

* [Code style](https://guide.meteor.com/code-style.html)
* [Application structure](https://guide.meteor.com/structure.html)
* [Testing](https://guide.meteor.com/testing.html)

## License
Grow-IoT is released under the 2-Clause BSD License, sometimes referred to as the "Simplified BSD License" or the "FreeBSD License". 
