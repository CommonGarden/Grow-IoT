// TODO: a plant example... which is really just a simple model of a plant.
const Thing = require('../../dist/Thing.es6.js');

module.exports = new Thing({
	properties: {
		name: "Plant",
		target_day_temp: 75,
	},

	initialize: function () {
		console.log('Plant initialized. Ideal day time temperature is ' + this.get('target_day_temp') + 'F');
	},
});
