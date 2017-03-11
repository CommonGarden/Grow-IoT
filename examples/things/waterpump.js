const Thing = require('../../dist/Thing.es6.js');
const Hs100Api = require('hs100-api');

module.exports = new Thing({
	properties: {
		name: "Water pump"
	},

	initialize: function () {
        var client = new Hs100Api.Client();

		// Look for plug, assign to plug property.
        client.startDiscovery().on('plug-new', (plug) => {
          if (plug.name === 'Water Pump') {
            console.log('Water pump initialized');
            this.pump = plug;
          }
        });
	},

    turn_on: function () {
        if (this.pump) {
            this.pump.setPowerState(true);
        }
        console.log("Pump on");
    },

    turn_off: function () {
        console.log("Pump off");
        if (this.pump) {
            this.pump.setPowerState(false);
        }
    }
});


