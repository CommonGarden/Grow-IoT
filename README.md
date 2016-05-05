## Status: Working on Alpha release... please be comfortable with chaos until May 19th.

<!-- Should we just use gitter or IRC? -->
<!-- [![Slack Status](http://slack.commongarden.org/badge.svg)](http://slack.commongarden.org) -->

[Feature Requests](http://forum.commongarden.org/c/feature-requests)

[General Feedback](http://forum.commongarden.org/c/feedback)

## An Extensible, document-based, completely open source IoT Stack
Together with [grow.js](), Grow-IoT is a full javascript based IoT stack with a simple API and basic user interface. Use it to run your own home network in the cloud, or as the basis for your own IoT app.

After the initial alpha launch, we hope to begin working on problems such as improving the usability and security for configuring devices, splitting up the code base into more useful modules, and contributing useful feedback / code back to [W3C Internet of Things interest group]().

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

If not, you can still try out the library, just follow the [quickstart example in the grow.js readme]().

### Setting up an instance on Meteor Galaxy

You can easily host **your own** Grow-IoT instance on [Meteor Galaxy](https://galaxy.meteor.com/). See the Meteor Galaxy website for instructions on hosting a new meteor application.

See [instructions in Grow.js for securely connecting devices to the instance]().

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
