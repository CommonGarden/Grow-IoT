// TODO: a plant example... which is really just a simple model of a plant.
const Thing = require('../../dist/Thing.es6.js');

// TODO: hs100 example with space heater plugged in.
const Hs100Api = require('hs100-api');


module.exports = new Thing({
	properties: {
		name: "Heater",
        state: "off"
	},

	initialize: function () {
		console.log('Heater initialized');

        var client = new Hs100Api.Client();

        // Look for plug, assign to plug property.
        client.startDiscovery().on('plug-new', (plug) => {
          if (plug.name === 'Heater') {
            this.heater = plug;
          }
        });
	},

    turn_on: function () {
        if (this.get('state') === 'off') {
            this.set('state', 'on');
            this.heater.setPowerState(true);
            console.log("Heater on");
        }
    },

    turn_off: function () {
        this.set('state', 'off');
        this.heater.setPowerState(false);
        console.log("Heater off");
    }
});
