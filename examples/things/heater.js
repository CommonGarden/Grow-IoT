const Thing = require('../../dist/Thing.js');

// Third party APIs are easy to integrate!
const Hs100Api = require('hs100-api');


module.exports = new Thing({
	properties: {
		name: "Heater",
        state: "off"
	},

	initialize: function () {
        var client = new Hs100Api.Client();

        // Look for plug, assign to plug property.
        client.startDiscovery().on('plug-new', (plug) => {
          if (plug.name === 'Heater') {
            console.log('Heater connected');
            this.heater = plug;
          }
        });
	},

    turn_on: function () {
        if (this.get('state') === 'off') {
            this.set('state', 'on');
            if (this.heater) {
                this.heater.setPowerState(true);
            }
            console.log("Heater on");
        }
    },

    turn_off: function () {
        this.set('state', 'off');
        if (this.heater) {
            this.heater.setPowerState(false);
        }
        console.log("Heater off");
    }
});
