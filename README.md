# Grow-IoT
## Automation + IoT software for growing things!

[![Join the chat at https://gitter.im/CommonGarden/Grow-IoT](https://badges.gitter.im/CommonGarden/Grow-IoT.svg)](https://gitter.im/CommonGarden/Grow-IoT?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Connect custom and 3rd party IoT devices and use them to automate growing environments. 

Control variables like:
* Moisture
* Light
* pH
* Nutrient dosing
* Dissolved Oxygen
* CO2

Please open issues or PRs with suggestions for improvements.

![Example screenshot](https://raw.githubusercontent.com/CommonGarden/Grow-IoT/master/public/example.png)

Together with [Grow.js](https://github.com/CommonGarden/Grow.js), Grow-IoT is a full javascript based IoT stack with a simple API and basic user interface. Use it to run *your own* home network in the cloud, or as the basis for your own IoT app.

The Grow-IoT framework allows you to:
* Securely connect and store data from devices
* Schedule actions (such as turning the lights on every day at 8:30 am).
* Easily create and add new IoT devices with [Grow.js](https://github.com/CommonGarden/Grow.js), using whatever board you want.
* Have complete ownership over your data.
* Calibrate sensors *(coming soon!)*

Current status is pre-alpha. We are working examples and providing support for the widely used MQTT protocol.

# Installing Grow-IoT

You need to install [Meteor](https://www.meteor.com/) if you haven't already. To do so, open your terminal and enter:
```bash
curl https://install.meteor.com/ | sh
```

Then clone the repo, enter the new directory, and start meteor.

```bash
git clone https://github.com/CommonGarden/Grow-IoT
cd Grow-IoT
npm install
meteor
```

And that's it! Visit http://localhost:3000 with your browser of choice; you should now have a meteor application running.

**Next step:** Create an account. You will use the email address you create your account with when you connect to your Grow-IoT instance.

# Hardware setup

Grow-IoT works with many devices. For help getting started with any of these popular devices, see their wiki pages:

+ [Raspberry Pi](https://github.com/CommonGarden/Grow-IoT/wiki/Raspberry-Pi)
<!-- + [Tessel 2]()
+ [Chip]()
+ [Particle]() -->


# Quickstart

First, make a Grow.js project for a software light you want to control (see the [Grow.js Library](https://github.com/CommonGarden/Grow.js) for hardware examples):

```bash
mkdir my-plant-light
cd my-plant-light
npm init -y
npm install --save Grow.js
```

Now, let's make a file called light.js that defines a light for a plant we may be growing. 

**NOTE: Be sure to set the 'username' property below to the username you created an account with.**

**light.js**

```javascript
// Import the grow.js library.
var GrowInstance = require('Grow.js');

// Create a new grow instance. Connects by default to localhost:3000
// Create a new grow instance.
    var grow = new GrowInstance({
        name: 'Light', // The display name for the thing.
        description: 'An LED light with a basic on/off api.',
        
        // The username of the account you want this device to be added to.
        username: 'YOURUSERNAMEHERE',

        // Properties can be updated by the API
        properties: {
            state: 'off'
        },

        // Actions are the API of the thing.
        actions: {
            turn_light_on: {
                name: 'On', // Display name for the action
                description: 'Turns the light on.', // Optional description
                schedule: 'at 9:00am', // Optional scheduling using later.js
                function: function () {
                    // The implementation of the action.
                    console.log('Light on');

                    // Emit a 'light on' event
                    grow.emitEvent('Light on');

                    // Set the state property to 'on'
                    grow.set('state', 'on');
                }
            },
            turn_light_off: {
                name: 'off',
                schedule: 'at 8:30pm', // Run this function at 8:30pm
                function: function () {
                    console.log('Light off');

                    // Emit a 'light off' event
                    grow.emitEvent('Light off');

                    // Set the state property to 'off'
                    grow.set('state', 'off');
                }
            },
            light_data: {
                name: 'Log light data',
                // type and template need for visualization component... HACK. 
                type: 'light',
                template: 'sensor',
                schedule: 'every 1 second',
                function: function () {
                    // Send data to the Grow-IoT app.
                    grow.log({
                      type: 'light',
                      value: Math.random()
                    });
                }
            }
        }
    });
```

Run the script with:

```bash
node light.js
```

Next, visit [http://localhost:3000](http://localhost:3000) in your browser.

Create a new environment and you should see the device. Click on it to add it to the environment.

Like magic, you will see a generated UI based on the configuration object you passed in.

![Example screenshot](https://raw.githubusercontent.com/CommonGarden/Grow-IoT/master/public/example.png)

If you click on one of the buttons, you should see the appropriate log message in the terminal where you are running `light.js`.

### Cool! What did I just do?

Well, running `light.js` for the first time:

1. Connects to the Grow-IoT host (ddp).

2. Registers the device with host server. The information in config object is used to create a UI and API.

3. Saves state to a file `state.json`, so if the device powers off or resets, it resumes it's last configuration.

4. Sets up readable and writable streams and listens for commands.

[Full Grow.js documentation and examples can be found here](http://commongarden.github.io/Grow.js/docs/). Also checkout our [wiki](https://github.com/CommonGarden/Grow-IoT/wiki) for a growing collection of examples for various boards and sensors, including:

* [Raspberry Pi](https://github.com/CommonGarden/Grow-IoT/wiki/Raspberry-Pi)
* [Tessel 2](https://github.com/CommonGarden/Grow-IoT/wiki/Tessel-2)
* [Atlas Scientific Sensors](https://github.com/CommonGarden/Grow-IoT/wiki) (includes pH, Dissolved Oxygen, and conductivity)

# Code organization
The code is organized in the `packages` folder. Grow-IoT is a meteor application currently comprised of 3 packages:

* api: a server for interacting with devices
* app: the frontend application
* core: document models

### Setting up an instance on Meteor Galaxy

You can easily host **your own** Grow-IoT instance on [Meteor Galaxy](https://galaxy.meteor.com/). See the Meteor Galaxy website for instructions on hosting a new meteor application.

See [instructions in Grow.js for securely connecting devices to the instance](https://github.com/CommonGarden/grow.js).

### Python support
You can interact with the Grow-IoT api using the [Python DDP library](https://github.com/hharnisc/python-ddp).

## Contributing

Bitcoin address: 15TQgBpJ7u3PNRrw7tdkLxZw4ybEdATuvv

Please read:
* [Code of Conduct](https://github.com/CommonGarden/Organization/blob/master/code-of-conduct.md)
* [Contributing info](https://github.com/CommonGarden/Organization/blob/master/contributing.md)

### License
Grow-IoT is released under the 2-Clause BSD License, sometimes referred to as the "Simplified BSD License" or the "FreeBSD License". 
