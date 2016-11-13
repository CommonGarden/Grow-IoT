# Grow-IoT

[![Join the chat at https://gitter.im/CommonGarden/Grow-IoT](https://badges.gitter.im/CommonGarden/Grow-IoT.svg)](https://gitter.im/CommonGarden/Grow-IoT?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

![Example image](https://cloud.githubusercontent.com/assets/521978/20240422/a50694ee-a8cc-11e6-97f5-81b636149b85.png)

Grow-IoT allows you to:
* Create custom devices / things with webcomponents #usetheplatform
* Securely connect and store data from sensors and actuators
* *Beta*: Create interelationships and workflows between things

If you think the Internet of Things should be based on open standards and interoperable by design (kind of like the web)... well, you've come to the right place. Let's make it easier for scientists of all ages to start collecting data from sensors.

## Installing Grow-IoT

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

Create a test thing (click the '+' button and then the one that says 'Create test thing'). Start by playing with the `test-thing.html` in the `imports/things/` folder.

## Adding components

Grow-IoT is [webcomponent](http://webcomponents.org/) based and modular. It's easy to create a new component, or add an existing one.

To add a component:
1. Install it with [bower](https://bower.io/).
2. Then add it to the `imports/ui/imports.html` file. 

Now it's ready to use in Grow-IoT! For more information on creating custom elements see the [polymer project](https://www.polymer-project.org/1.0/).

## Connecting devices (or software things)

You can interact with the Grow-IoT api using the Distributed Data Protocol. *There are DDP Clients available in many different programming languages*, see http://meteorpedia.com/read/DDP_Clients for a list.

[Grow.js](https://github.com/CommonGarden/Grow.js) is a helper library that makes it fairly easy to connect a thing to Grow-IoT.

### Examples
* https://github.com/CommonGarden/dr-dose
* https://github.com/CommonGarden/smart-pot

## Contributing
Be kind to one another. All are welcome.

See the following for more info:

* [Code of Conduct](https://github.com/CommonGarden/Organization/blob/master/code-of-conduct.md)
* [Contributing Info](https://github.com/CommonGarden/Organization/blob/master/contributing.md)

### Code Style
For now, we are sticking closely to what's documented in the Meteor guide. Take a look at the following for more info and helpful examples:

* [Code style](https://guide.meteor.com/code-style.html)
* [Application structure](https://guide.meteor.com/structure.html)
* [Testing](https://guide.meteor.com/testing.html)

## License
Grow-IoT is released under the 2-Clause BSD License, sometimes referred to as the "Simplified BSD License" or the "FreeBSD License". 
