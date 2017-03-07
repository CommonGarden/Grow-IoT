const Thing = require('../../dist/Thing.es6.js');
const Hs100Api = require('hs100-api');

module.exports = new Thing({
	properties: {
		name: "Water pump"
	},

	initialize: function () {
		console.log('Water pump initialized');

        var client = new Hs100Api.Client();

		// Look for plug, assign to plug property.
        client.startDiscovery().on('plug-new', (plug) => {
          if (plug.name === 'Water Pump') {
            this.pump = plug;
          }
        });
	},

    turn_on: function () {
    	this.pump.setPowerState(true);
        console.log("Pump on");
    },

    turn_off: function () {
        console.log("Pump off");
        this.pump.setPowerState(false);
    }
});


