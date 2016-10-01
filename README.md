### If you are looking for the old prototype, checkout the master branch.

# Grow-IoT
## Status: work in progress

[![Join the chat at https://gitter.im/CommonGarden/Grow-IoT](https://badges.gitter.im/CommonGarden/Grow-IoT.svg)](https://gitter.im/CommonGarden/Grow-IoT?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Connect custom and 3rd party IoT devices and use them to automate growing environments. 

Control variables like:
* Moisture
* Light
* pH
* Nutrient dosing
* Dissolved Oxygen
* CO2

Together with [Grow.js](https://github.com/CommonGarden/Grow.js), Grow-IoT is a full javascript based IoT stack with a simple API and basic user interface. Use it to run *your own* home network in the cloud, or as the basis for your own IoT app.

The Grow-IoT framework allows you to:
* Securely connect and store data from devices
* Create custom devices / things with web components *(in progress)*
* Schedule actions (such as turning the lights on every day at 8:30 am).
* Have complete ownership over your data.

# Installing Grow-IoT

You need to install [Meteor](https://www.meteor.com/) if you haven't already. To do so, open your terminal and enter:
```bash
curl https://install.meteor.com/ | sh
```

Then clone the repo, enter the new directory, and start meteor.

```bash
git clone https://github.com/CommonGarden/Grow-IoT
cd Grow-IoT
meteor npm install
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

### Distributed Data Protocol

You can interact with the Grow-IoT api using the Distributed Data Protocol. There are DDP Clients available in many different programming languages, see http://meteorpedia.com/read/DDP_Clients for a list.

# 'Cloud' setup
### Setting up an instance on Meteor Galaxy

You can easily host **your own** Grow-IoT instance on [Meteor Galaxy](https://galaxy.meteor.com/). See the Meteor Galaxy website for instructions on hosting a new meteor application.

See [instructions in Grow.js for securely connecting devices to the instance](https://github.com/CommonGarden/grow.js).

## Contributing

Please read:
* [Code of Conduct](https://github.com/CommonGarden/Organization/blob/master/code-of-conduct.md)
* [Contributing info](https://github.com/CommonGarden/Organization/blob/master/contributing.md)

### License
Grow-IoT is released under the 2-Clause BSD License, sometimes referred to as the "Simplified BSD License" or the "FreeBSD License". 
