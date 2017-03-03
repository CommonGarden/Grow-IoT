// TODO: a plant example... which is really just a simple model of a plant.
const Thing = require('../../dist/Thing.es6.js');

// A rough example... first draft, it's crude.
module.exports = new Thing({
	properties: {
		name: "Plant",
		target_day_temp: 75,
		min_temp: 60,
		max_temp: 80,
		day_start: 'at 8:00am',
		night_start: 'at 7:00pm',
	},

	initialize: function () {
		console.log('Plant initialized. Ideal day time temperature is ' + this.get('target_day_temp') + 'F');
	},
});
