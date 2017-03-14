const Thing = require('Grow.js');
const Hs100Api = require('hs100-api');

module.exports = new Thing({
	properties: {
		name: "Light"
	},

	start: function () {
	    var client = new Hs100Api.Client();

	    client.startDiscovery().on('plug-new', (plug) => {
	      // There is definitely a better way of doing this.
	      if (plug.name === 'Plant Light') {
	        this.light = plug;
	      }
	    });
	},

    turn_on: function () {
      if (this.light) {
        this.light.setPowerState(true);
      }
      console.log("Light on");
    },

    turn_off: function () {
      console.log("Light off");
      if (this.light) {
        this.light.setPowerState(false);
      }
    }
});


