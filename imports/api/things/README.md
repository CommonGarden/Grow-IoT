# Things

There are lots of different types of things, sensors and actuators are one class of things, but there are many others:

* A brocolli plant
* etc.

A thing is basically a fancy event emitter with inputs and outputs (see [Thing.js](https://github.com/CommonGarden/Thing.js)). Inputs occur in the form of methods, outputs in the form of events. [See Node events documentation](https://nodejs.org/dist/latest-v7.x/docs/api/events.html).

With Grow-IoT you can also include an custom web interface (an `.html` file).

We use this interface to create both a realtime dashboard view and *eventually* a logic view (think [node-red](https://nodered.org/) with a major facelift).


