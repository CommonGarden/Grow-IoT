// TODO: a plant example... which is really just a simple model of a plant.
const Thing = require('../../dist/Thing.es6.js');

// A rough GrowFile example... first draft, it's crude.
module.exports = new Thing({
	properties: {
		name: "Grow File example",
		version: '0.1.0',
		alerts: {
			temperature: {
				min: 60,
				max: 80
			},
			ph: {
				min: 5.6,
				max: 6.7
			},
			humidity: {
				min: 10 // percent
			},
		},

		// cycles can be an option inside of phases.
		cycles: {
			day: {
				start: 'after 7:00am',
				targets: {
					temperature: 75
				}
			},
			night: {
				start: 'after 7:00pm',
				targets: {
					temperature: 65
				}
			}
		}
	}
});
