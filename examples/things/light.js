const Thing = require('../../lib/Thing.js');
const Hs100Api = require('hs100-api');

module.exports = new Thing({
	properties: {
		name: "Light",
    state: "off"
	},

	initialize: function () {
    var client = new Hs100Api.Client();

    client.startDiscovery().on('plug-new', (plug) => {
      // There is definitely a better way of doing this.
      if (plug.name === this.get('name')) {
        this.light = plug;
      }
    });
	},

  turn_on: function () {
    if (this.light) {
      this.light.setPowerState(true);
    }
    this.set('state', 'on');
    console.log("Light on");
  },

  turn_off: function () {
    if (this.light) {
      this.light.setPowerState(false);
    }
    this.set('state', 'off');
    console.log("Light off");
  }
});


