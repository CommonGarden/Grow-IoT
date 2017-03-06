// TODO: a plant example... which is really just a simple model of a plant.
const Thing = require('../../dist/Thing.es6.js');

// TODO: hs100 example with space heater plugged in.

module.exports = new Thing({
	properties: {
		name: "Heater",
        state: "off"
	},

	initialize: function () {
		console.log('Heater initialized');
	},

    turn_on: function () {
        if (this.get('state') === 'off') {
            this.set('state', 'on');
            console.log("Heater on");
        }
    },

    turn_off: function () {
        this.set('state', 'off');
        console.log("Heater off");
    }
});
