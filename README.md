[![Slack Status](http://slack.commongarden.org/badge.svg)](http://slack.commongarden.org)

[Feature Requests](http://forum.commongarden.org/c/feature-requests)

[General Feedback](http://forum.commongarden.org/c/feedback)

# Installing CommonGarden-IoT (OSX and Linux)

You need to install [Meteor](https://www.meteor.com/) if you haven't already. To do so, open your terminal and enter:
```
curl https://install.meteor.com/ | sh
```

Then clone the repo, enter the new directory, and start meteor.

```
git clone https://github.com/CommonGarden/CommonGarden-IoT
cd CommonGarden-IoT
meteor
```

And that's it! You should now have an application running on http://localhost:3000

# Making and connecting new devices
For more info on making a device driver and connecting to Common Garden, see our [grow.js library](https://github.com/CommonGarden/grow.js). Or checkout out one of these examples:

* Simple LED light example: https://github.com/CommonGarden/cg-led-light-arduino
* Arduino Growkit: https://github.com/CommonGarden/growkit-arduino

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
Meteor-IoT is released under the 2-Clause BSD License, sometimes referred to as the "Simplified BSD License" or the "FreeBSD License". 
