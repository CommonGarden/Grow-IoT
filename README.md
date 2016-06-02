### Status: Prototype
#### Grow-IoT on [freenode](https://webchat.freenode.net/)

[![Join the chat at https://gitter.im/CommonGarden/Grow-IoT](https://badges.gitter.im/CommonGarden/Grow-IoT.svg)](https://gitter.im/CommonGarden/Grow-IoT?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Please open issues or PRs with suggestions for improvements. Let's make something useful!

<!-- Should we just use gitter or IRC? -->
<!-- [![Slack Status](http://slack.commongarden.org/badge.svg)](http://slack.commongarden.org) -->

[Feature Requests](http://forum.commongarden.org/c/feature-requests)

[General Feedback](http://forum.commongarden.org/c/feedback)

## An extensible, open source stack for growing things

![Example screenshot](https://raw.githubusercontent.com/CommonGarden/Grow-IoT/master/public/example.png)

Together with [grow.js](https://github.com/CommonGarden/grow.js), Grow-IoT is a full javascript based IoT stack with a simple API and basic user interface. Use it to run *your own* home network in the cloud, or as the basis for your own IoT app.

After the initial alpha launch, we hope to begin working on problems such as improving the usability and security for configuring devices, creating control systems, splitting up the code base into more useful modules, and contributing useful feedback / code back to [W3C Internet of Things interest group](https://github.com/w3c/web-of-things-framework).

# Installing Grow-IoT

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

# Quickstart

First, make a Grow.JS project for the plant you want to monitor:

```bash
mkdir my-cool-plant
cd my-cool-plant
npm init -y
npm install --save grow.js
```

Now, let's make a file that defines our plant. **Be sure to set the 'username' property to the username you created an account with.**

**plant.js**

```javascript
// Import the grow.js library.
var GrowInstance = require('grow.js');

// Create a new grow instance. Connects by default to localhost:3000
var grow = new GrowInstance({
    "name": "Light", // The display name for the thing.
    "description": "An LED light with a basic on/off api.",
    "state": "off", // The current state of the thing.

    // SET THIS TO THE EMAIL OF THE ACCOUNT YOU CREATED ON THE GROW-IOT APP.
    "username": "YOURUSERNAME", // Eventually we'll have api keys and proper UX for device configuration.
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
node plant.js
```

Next, visit [http://localhost:3000](http://localhost:3000) in your browser.

Create a new environment and you should see the device. Click on it to add it to the environment.

Like magic, you will see a generated UI based on the configuration object you passed in.

![Example screenshot](https://raw.githubusercontent.com/CommonGarden/Grow-IoT/master/public/example.png)

If you click on one of the buttons, you should see the appropriate log message in the terminal where you are running `plant.js`.

### Cool! What did I just do?

Well, running `plant.js` for the first time:

1. Connects to the Grow-IoT host (ddp).

2. Registers the device with host server. The information in config object is used to create a UI and API.

3. Saves state to a file `state.json`, so if the device powers off or resets, it resumes it's last configuration.

4. Sets up readable and writable streams and listens for commands.

[Full grow.js documentation and examples can be found here](http://commongarden.github.io/grow.js/).

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

### License
Grow-IoT is released under the 2-Clause BSD License, sometimes referred to as the "Simplified BSD License" or the "FreeBSD License". 
