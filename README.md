## Status: Working on Alpha release... please be comfortable with chaos until May 19th.

<!-- Should we just use gitter or IRC? -->
<!-- [![Slack Status](http://slack.commongarden.org/badge.svg)](http://slack.commongarden.org) -->

[Feature Requests](http://forum.commongarden.org/c/feature-requests)

[General Feedback](http://forum.commongarden.org/c/feedback)

## An Extensible, document-based, completely open source IoT Stack
Together with [grow.js](https://github.com/CommonGarden/grow.js), Grow-IoT is a full javascript based IoT stack with a simple API and basic user interface. Use it to run your own home network in the cloud, or as the basis for your own IoT app.

After the initial alpha launch, we hope to begin working on problems such as improving the usability and security for configuring devices, splitting up the code base into more useful modules, and contributing useful feedback / code back to [W3C Internet of Things interest group](https://github.com/w3c/web-of-things-framework).

# Getting Started with Grow-IoT (OSX and Linux)

You need to install [Meteor](https://www.meteor.com/) if you haven't already. To do so, open your terminal and enter:
```bash
curl https://install.meteor.com/ | sh
```

Then clone the repo, enter the new directory, and start meteor.

```bash
git clone https://github.com/CommonGarden/Grow-IoT
cd Grow-IoT
meteor
```

And that's it! Visit http://localhost:3000 with your browser of choice; you should now have a meteor application running.

**Next step:** Create an account. You will use the email address you create your account with when you connect to your Grow-IoT instance.

If you have a microcontroller like a raspberry pi, arduino, Chip, Tessel 2, etc... head on over to the [Grow.js library](https://github.com/CommonGarden/grow.js) to get started connecting it to Grow-IoT.

If not, no worries! The quickstart tutorial below doesn't require any hardware or wiring. :party:

# Quickstart
If you haven't already, [install and start the Grow-IoT meteor application](https://github.com/CommonGarden/Grow-IoT), visit [http:localhost:3000/](http:localhost:3000/) and create an account (you will need it to add your device).

Clone the repo and enter the new directory:
```bash
git clone https://github.com/CommonGarden/grow.js
cd grow.js
```

Install the needed software dependencies with:

```bash
npm install
```

Note: if you haven't installed npm and node.js, please follow the [instructions to do so on the nodejs.org website](https://nodejs.org/en/).

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

[Insert screenshot]

If you click on one of the buttons, you should see the appropriate log message in the terminal where you are running `example.js`.

### Setting up an instance on Meteor Galaxy

You can easily host **your own** Grow-IoT instance on [Meteor Galaxy](https://galaxy.meteor.com/). See the Meteor Galaxy website for instructions on hosting a new meteor application.

See [instructions in Grow.js for securely connecting devices to the instance](https://github.com/CommonGarden/grow.js).

### Python support
You can interact with the Grow-IoT api using the [Python DDP library](https://github.com/hharnisc/python-ddp).

## Contributing

Please read:
* [Code of Conduct](https://github.com/CommonGarden/Organization/blob/master/code-of-conduct.md)
* [Contributing info](https://github.com/CommonGarden/Organization/blob/master/contributing.md)

### Reach out
Get involved with our community in any way you are interested:

<!-- * [Join us on Slack](http://slack.commongarden.org) — Collaboration and real time discussions. -->
* [Forum](http://forum.commongarden.org/) — General discussion and support by the Common Garden community.

### Acknowledgements
Special thanks to @mitar for contributing the starting point for this library. This work was also inspired by work the W3C interest group on the internet of things.

### License
Grow-IoT is released under the 2-Clause BSD License, sometimes referred to as the "Simplified BSD License" or the "FreeBSD License". 
