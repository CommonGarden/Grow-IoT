### Status: Prototype
Please open issues or PRs with suggestions for improvements. Let's make something useful!

Grow.js is an npm packagle for creating and connecting devices to a [Grow-IoT](https://github.com/CommonGarden/Grow-IoT) instance. It is loosely based off of some of the work happening on the W3C web-of-things community group. [Full grow.js documentation can be found here](http://commongarden.github.io/grow.js/).

# Quickstart - no hardware or wiring required
**If you haven't already, [install and start the Grow-IoT meteor application](https://github.com/CommonGarden/Grow-IoT). Note, you will have to run this in a new terminal window.**

Be sure to visit [http:localhost:3000/](http:localhost:3000/) and create an account, you will need it to add your device.

If you haven't installed npm and node.js, please follow the [instructions to do so on the nodejs.org website](https://nodejs.org/en/).

Clone the repo and enter the new directory:
```bash
git clone https://github.com/CommonGarden/grow.js
cd grow.js
```

Install the needed software dependencies with:

```bash
npm install
```

Now you are ready to run `example.js`!

### Example.js

Take a look at the file called, `example.js` copied below. **Be sure to set the 'owner' property to the email you created an account with.**

```javascript
// Import the grow.js library.
var GrowInstance = require('./grow.js');

// Create a new grow instance. Connects by default to localhost:3000
var grow = new GrowInstance({
    "name": "Light", // The display name for the thing.
    "description": "An LED light with a basic on/off api.",
    "state": "off", // The current state of the thing.

    // SET THIS TO THE EMAIL OF THE ACCOUNT YOU CREATED ON THE GROW-IOT APP.
    "owner": "jake@commongarden.org",
    "actions": [ // A list of action objects
        {
            "name": "On", // Display name for the action
            "description": "Turns the light on.", // Optional description
            "id": "turn_light_on", // A unique id
            "updateState": "on", // Updates state on function call
            "schedule": "at 9:00am", // Optional scheduling using later.js
            "event": "Light turned on", // Optional event to emit when called.
            "function": function () {
                // The implementation of the action.
                // Here we simply log "Light on." See links to hardware
                // examples below to begin using microcontrollers
                console.log("Light on."); 
            }
        },
        {
            "name": "off",
            "id": "turn_light_off",
            "updateState": "off",
            "schedule": "at 8:30pm",
            "event": "Light turned off",
            "function": function () {
                console.log("Light off.");
            }
        }
    ],
    "events": [
        {
            "name": "Light data", // Events get a display name like actions
            "id": "light_data", // An id that is unique to this device
            "type": "light", // Data type. There might be different kinds of events?
            "schedule": "every 1 second", // Currently required
            "function": function () {
                // function should return the event to emit when it should be emited.
                return Math.random();
            }
        }
    ]
}, function start () {
    // Optional Callback function. Calls turn_light_off function on start.
    grow.callAction("turn_light_off");
});
```

Run the script with:

```bash
node example.js
```

This does a couple of things:

1. Connects to the host over the ddp protocol.

2. Registers the device with host server. The information in config object is used to create a UI and API.

3. Saves state to state.json so if the device powers off or resets, it resumes it's last configuration.

4. Sets up readable and writable streams and listens for commands.

Next, visit [http://localhost:3000](http://localhost:3000) in your browser.

Create a new environment and you should see the device, click on it to add it to the environment.

Like magic, you will see a generated UI based on the configuration object you passed in.

![Example screenshot](https://raw.githubusercontent.com/CommonGarden/Grow-IoT/master/public/example.png)

If you click on one of the buttons, you should see the appropriate log message in the terminal where you are running `example.js`.

# Working with hardware.

See the [examples folder](https://github.com/CommonGarden/grow.js/tree/master/examples) for hardware examples with various boards. 

Please feel free to create your own and share it on the [forum](http://forum.commongarden.org/).

Grow.js works with most devices that can run node, and plays very well with the [Johnny-Five robotics library](http://johnny-five.io/), which has plugins for [a large number of devices](http://johnny-five.io/#platform-support). Note, with boards like the Tessel 2, Johnny-five is not required, but we're including it to make it easier to get started and support a wide variety of devices, sensors, and actuators.

Install johnny-five with:

```bash
npm install johnny-five
```

### Wire up photo-resitor and led to arduino
Wire up your photo resistor and LED light like so:

![Wiring diagram](https://raw.githubusercontent.com/CommonGarden/grow.js/development/img/Arduino-light-detector-circuit.png)

To use [Johnny-Five](http://johnny-five.io/), you need to make sure that your arduino is flashed with Standard Firmata. Instructions for doing so can be found [here](https://github.com/rwaldron/johnny-five/wiki/Getting-Started#trouble-shooting). Once that's done you're ready for the next step!

Take a look at the [led-and-photoresistor arduino example]() in the `examples/arduino/` folder. **Be sure to set the 'owner' property to the email you created an account with.**

```javascript
// Require the grow.js and johnny-five libraries.
var GrowInstance = require('../../.././grow.js'); // Path to latest build
var five = require('johnny-five');

// Create a new board object
var board = new five.Board();

// When board is ready run this start function.
board.on("ready", function start() {
    // Define variables using Johnny-five classes
    // Note: if you wire the device slightly differently you may need to change the pin numbers.
    var LED = new five.Pin(13),
        lightSensor = new five.Sensor("A0");

    // Create a new grow instance.
    var grow = new GrowInstance({
        "name": "Light", // The display name for the thing.
        "desription": "An LED light with a basic on/off api.",
        "state": "off", // The current state of the thing.
        "owner": "jake@commongarden.org", // The email of the account you want this device to be added to.
        "actions": [ // A list of action objects
            {
                "name": "On", // Display name for the action
                "description": "Turns the light on.", // Optional description
                "id": "turn_light_on", // A unique id
                "updateState": "on", // Updates state on function call
                "schedule": "at 9:00am", // Optional scheduling using later.js
                "event": "Light turned on", // Optional event to emit when called.
                "function": function () {
                    // The implementation of the action.
                    LED.high();
                }
            },
            {
                "name": "off",
                "id": "turn_light_off",
                "updateState": "off",
                "schedule": "at 8:30pm",
                "event": "Light turned off",
                "function": function () {
                    LED.low();
                }
            }
        ],
        "events": [
            {
                "name": "Light data", // Events get a display name like actions
                "id": "light_data", // Events also get an id that is unique to the device
                "type": "light", // Data type.
                "schedule": "every 1 second", // Events should have a schedule option that determines how often to check for conditions.
                "function": function () {
                    // function should return the event to emit
                    return lightSensor.value;
                }
            }
        ]
    });
});
```

Run the new `example.js` file with:

```bash
node examples/arduino/example.js
```

Note: on certain opperating systems you may need to prefix that command with `sudo` to allow the script access to USB.

[Full grow.js documentation and examples can be found here](http://commongarden.github.io/grow.js/).

# Connecting devices
### Host / Port
The host is where the device will be looking for a CommonGarden-IoT instance. By default the host is set to `localhost` and the port is set to Meteor's standard of `3000`. This will work nicely for usb devices like Arduino.

For connecting over wifi, connect your device to wifi and set the `host` to the IP address where the Grow-IoT instance is running. Simply specify it in your grow.json file.

```json
    "host": "YOUR_IP_HERE",
    "thing": {...}
```

#### Connecting over SSL
You can connect securely to our Grow-IoT alpha instance on https://grow.commongarden.org, or see the [Grow-IoT repo](https://github.com/CommonGarden/Grow-IoT) to easily start your own IoT network locally or hosted on [Meteor Galaxy](https://galaxy.meteor.com).

SSL is supported though will require a bit more setup. If you are hosting your instance off a computer with a dedicated IP address include the following info in your configuration object.

```json
    "host": "YOUR_IP_HERE",
    "port": 443,
    "ssl": true,
```

If you are hosting on a cloud instance such as [Meteor Galaxy](https://galaxy.meteor.com), you might need specify the servername. The example below shows you how to connect securely to the instance at [grow.commongarden.org](https://grow.commongarden.org):

```json
    "host": "grow.commongarden.org",
    "tlsOpts": {
        "tls": {
            "servername": "galaxy.meteor.com"
        }
    },
    "port": 443,
    "ssl": true,
    "thing": { ... }
```

# Developing

Eventually we'll be making libraries for other languages (not everything can or should run a highlevel language like Javascript) like Lua and python.

Code will soon be ported to ES6 (a good excuse to rewrite the code and add tests). 

We use [gulp](http://gulpjs.com/) as our task runner. We use it to run tests, build docs, minify the code, lint things, etc.

`gulp build` concatonates the files in the `src` folder into one grow.js file.

`gulp test` runs tests in the test folder.

The documentation is written in jsdoc, built using [Mr-Doc](https://mr-doc.github.io/), and kept on the gh-pages branch of this repo.

# Contributing

Please read:
* [Code of Conduct](https://github.com/CommonGarden/Organization/blob/master/code-of-conduct.md)
* [Contributing info](https://github.com/CommonGarden/Organization/blob/master/contributing.md)

<!-- ### Reach out
Get involved with our community in any way you are interested: -->

<!-- * [Join us on Slack](http://slack.commongarden.org) — Collaboration and real time discussions. -->
<!-- * [Forum](http://forum.commongarden.org/) — General discussion and support by the Common Garden community. -->

### Acknowledgements
Special thanks to @Mitar for contributing the starting point for this library. This work was also inspired by work the [W3C interest group on the internet of things](https://github.com/w3c/web-of-things-framework).

## License
Grow.js is released under the 2-Clause BSD License, sometimes referred to as the "Simplified BSD License" or the "FreeBSD License".
