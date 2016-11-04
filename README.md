# Grow-IoT

[![Join the chat at https://gitter.im/CommonGarden/Grow-IoT](https://badges.gitter.im/CommonGarden/Grow-IoT.svg)](https://gitter.im/CommonGarden/Grow-IoT?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

The webcomponent powered hypothetical WoT (web of things) framework of the future allows you to:
* Create custom devices / things with webcomponents
* Securely connect and store data from sensors and actuators
* Visualize and analyze data
* Create interelationships and workflows between sensors

If you think the Internet of Things should be based on open standards and interoperable by design (kind of like the web)... well, you've come to the right place. ; )

# Installing Grow-IoT

You need to install [Meteor](https://www.meteor.com/) if you haven't already. To do so, open your terminal and enter:
```bash
curl https://install.meteor.com/ | sh
```

Webcomponents are a new web standard, but the polyfills (code that makes them work in older browsers) are pretty good by this point. However, you still need to install [vulcanize](https://github.com/Polymer/vulcanize) globally; it builds html for older browsers.

`npm install -g vulcanize`

Then clone the repo, enter the new directory, npm install, bower install, and run the `run.sh` script (which vulcanizes the public/imports.html file to build.html before starting meteor).

```bash
git clone https://github.com/CommonGarden/Grow-IoT
cd Grow-IoT
meteor npm install
bower install
./run.sh
```

And that's it! Visit http://localhost:3000 with your browser of choice; you should now have the application running.

# Hardware setup

Grow-IoT works with many devices. Updated instructions for connecting comming soon...

### Distributed Data Protocol

You can interact with the Grow-IoT api using the Distributed Data Protocol. *There are DDP Clients available in many different programming languages*, see http://meteorpedia.com/read/DDP_Clients for a list.

We use the Node.js client with [Grow.js](https://github.com/CommonGarden/Grow.js): https://github.com/oortcloud/node-ddp-client

# 'Cloud' setup
### Setting up an instance on Meteor Galaxy

You can easily host **your own** Grow-IoT instance on [Meteor Galaxy](https://galaxy.meteor.com/). See the Meteor Galaxy website for instructions on hosting a new meteor application.

See [instructions in Grow.js for securely connecting devices to the instance](https://github.com/CommonGarden/grow.js).

## Contributing
In a sentence, be kind to one another. All are welcome, please see the following:

* [Code of Conduct](https://github.com/CommonGarden/Organization/blob/master/code-of-conduct.md)
* [Contributing Info](https://github.com/CommonGarden/Organization/blob/master/contributing.md)

Since this project lies at the intersection of hardware, software, design, living things, etc... we've setup special Gitter (Slack sucks) channel rooms:

* [Grow-IoT Developers chat](https://gitter.im/CommonGarden/Grow-IoT): *Let's build something useful and push the boundaries of our knowledge.*
* [UX / UI designers chat](https://gitter.im/CommonGarden/UX):  *Making things usable for people who don't know shit about Javascript is what we **need** to do.*
* [Hardware makers](https://gitter.im/CommonGarden/Makers): *How can we make your job easier?*
* [Growers chat](https://gitter.im/CommonGarden/Growers): *How can we make your job easier?*

#### Code Style
For now, we are sticking closely to what's documented in the Meteor guide. Take a look at the following for more info and helpful examples:

* [Code style](https://guide.meteor.com/code-style.html)
* [Application structure](https://guide.meteor.com/structure.html)
* [Testing](https://guide.meteor.com/testing.html)

### License
Grow-IoT is released under the 2-Clause BSD License, sometimes referred to as the "Simplified BSD License" or the "FreeBSD License". 
