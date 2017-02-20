// TODO: a plant example... which is really just a simple model of a plant.
const Thing = require('../../dist/Thing.es6.js');

module.exports = new Thing({
	properties: {
		name: "Light"
	},

	initialize: function () {
		console.log('Light initialized');
	},

    turn_on: function () {
        console.log("Light on");
    },

    turn_off: function () {
        console.log("Light off");
    }
});
