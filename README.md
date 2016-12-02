# Grow-IoT

[![Join the chat at https://gitter.im/CommonGarden/Grow-IoT](https://badges.gitter.im/CommonGarden/Grow-IoT.svg)](https://gitter.im/CommonGarden/Grow-IoT?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Grow-IoT allows you to:
* Create custom devices / things with webcomponents #usetheplatform
* Securely connect and store data from sensors and actuators
* Own your data ([host your own instance!](https://github.com/CommonGarden/Grow-IoT/wiki/Cloud-setup))
* *Beta*: Create interelationships and workflows between things

If you think the Internet of Things should be based on open standards and interoperable by design (kind of like the web)... well, you've come to the right place.

![Example image](https://cloud.githubusercontent.com/assets/521978/20240422/a50694ee-a8cc-11e6-97f5-81b636149b85.png)


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

Create a test thing (click the '+' button and then the one that says 'Create test thing'). Start by playing with the `test-thing.html` in the `imports/things/` folder.


### grow-elements
**We've started building a collection of useful custom elments in our [grow-elements repo](https://github.com/CommonGarden/grow-elements).** 

Currently, we have a start of some gauges for ph, temperature, and humidty:

![Current grow-elements ui](https://cloud.githubusercontent.com/assets/521978/20504229/3de347d6-affb-11e6-8002-f7c46a3e981a.png)


## Connecting devices (or virtual things)

You can interact with the Grow-IoT api using the Distributed Data Protocol. *There are DDP Clients available in many different programming languages*, see http://meteorpedia.com/read/DDP_Clients for a list.

[Grow.js](https://github.com/CommonGarden/Grow.js) is a helper library that makes it fairly easy to connect a thing to Grow-IoT. You can use it for both hardware or virtual things.

#### Connecting your first 'device'

Create a new device and take note of the device `uuid` and token.

In the `tests` folder checkout `test-device.js`.

Replace the `uuid` and `token` properties of the config object with the credentials you generate.

```javascript
// Import the latest build of the Grow.js library
var Thing = require('Grow.js');

// Create a new grow instance. Connects by default to localhost:3000
var testDevice = new Thing({
    // PUT YOUR UUID AND TOKEN HERE:
    uuid: 'ae3093d5-f6bb-47dd-911b-427e85b7d991',
    token: 'BmGKqZTh4MRzXMwPNeoqjNLLvFT6yQyG',
    
    // HACK, unfortunately needed for now...
    testDevice: true,

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

testDevice.connect();

```

You can run  this script with the following command, but be sure to replace the uuid and token, have Grow-IoT running locally, or it won't connect.

```bash
node tests/test-device.js
```

See [Grow.js](https://github.com/CommonGarden/Grow.js) for more info and examples. It plays well with the Johnny-Five robotics library, so many devices can be connected.

Feel free to add examples to the Wiki.

## Adding components

Grow-IoT is [webcomponent](http://webcomponents.org/) based and modular. It's easy to create a new component, or add an existing one.

To add a component:

1. Install it with [bower](https://bower.io/).

2. Then add it to the `imports/ui/imports.html` file.

3. Run the `./build.sh` script.

Now it's ready to use in Grow-IoT!

Checkout [CustomElements.io](https://customelements.io/) or [Polymer's elements catalogue](https://elements.polymer-project.org/) for components to import and use in your projects.

For more information on creating custom elements see the [polymer project](https://www.polymer-project.org/1.0/). 

### Hardware Examples
Will be documenting soon.
* https://github.com/CommonGarden/dr-dose
* https://github.com/CommonGarden/smart-pot

### Software examples
Grow-IoT supports all kinds of Things! Even models of ones you can't connect to the Internet, like a tree.

Here are some suggestions of web components you could make. I'll get around to making some eventually...
* Plants! Let's make a library of plants!
* Models of growing environments

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
