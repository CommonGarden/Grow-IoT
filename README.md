# Status: pre-alpha

Make proposals or comment on issues if you want to contribute. I'm currently working to get this documented and released with a first draft of the UI soon. 

[![Slack Status](http://slack.commongarden.org/badge.svg)](http://slack.commongarden.org)

[Feature Requests](http://forum.commongarden.org/c/feature-requests)

[General Feedback](http://forum.commongarden.org/c/feedback)

# Installing Grow-IoT (OSX and Linux)

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

And that's it! You should now have a meteor application running on http://localhost:3000

### Setting up an instance on Meteor Galaxy

You can easily host your own Grow-IoT instance on [Meteor Galaxy](https://galaxy.meteor.com/). See the Meteor Galaxy website for instructions on hosting a new meteor application.

# Making and connecting new devices
For more info on making a device driver and connecting to Common Garden, see our [grow.js library](https://github.com/CommonGarden/grow.js).

## Python support
You can interact with the Meteor-IoT api through the [Python DDP library](https://github.com/hharnisc/python-ddp).

## Contributing

Please read:
* [Code of Conduct](https://github.com/CommonGarden/Organization/blob/master/code-of-conduct.md)
* [Contributing info](https://github.com/CommonGarden/Organization/blob/master/contributing.md)

### Reach out
Get involved with our community in any way you are interested:

* [Join us on Slack](http://slack.commongarden.org) — Collaboration and real time discussions.
* [Forum](http://forum.commongarden.org/) — General discussion and support by the Common Garden community.

### Acknowledgements
Special thanks to @mitar for contributing the starting point for this library. This work was also inspired by work the W3C interest group on the internet of things.

## License
Grow-IoT is released under the 2-Clause BSD License, sometimes referred to as the "Simplified BSD License" or the "FreeBSD License". 
