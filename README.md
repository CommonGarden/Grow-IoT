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

Create a test thing (click the '+' button and then the one that says 'Create test thing'). You should see something like this:

![test-thing in Grow-IoT](https://cloud.githubusercontent.com/assets/521978/20084015/98061fc8-a514-11e6-8778-3de85abd98d5.png)

Start by playing with the `test-thing.html` in the `imports/things/` folder.

## Making custom components

Grow-IoT is [webcomponent](http://webcomponents.org/) based and modular. It's easy to create a new component:

```html
<!--
`test-thing`
An example of how to build a thing for Grow-IoT

@demo demo/index.html 
-->
<dom-module id="test-thing">
  <template>
    <style>
      :host {
        display: block;
      }
    </style>
    <h2>[[message]]</h2>
    <paper-button on-click="fireEvent">Fire event</paper-button>
  </template>

  <script>
    Polymer({

      is: 'test-thing',

      properties: {
        message: {
          type: String,
          value: 'Hello world',
        }
      },

      fireEvent (e) {
        this.fire("test-event",{
          test: true
        });
        console.log('Fired event!');
      }
    });
  </script>
</dom-module>

```

For more information on creating custom elements see the [polymer project](https://www.polymer-project.org/1.0/) for extensive documentation.

With regard to meteor integration see: https://github.com/meteorwebcomponents

## Distributed Data Protocol

You can interact with the Grow-IoT api using the Distributed Data Protocol. *There are DDP Clients available in many different programming languages*, see http://meteorpedia.com/read/DDP_Clients for a list.

### Hardware examples
* https://github.com/CommonGarden/dr-dose
* https://github.com/CommonGarden/smart-pot

See [Grow.js](https://github.com/CommonGarden/Grow.js) for more examples.

## 'Cloud' setup
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
