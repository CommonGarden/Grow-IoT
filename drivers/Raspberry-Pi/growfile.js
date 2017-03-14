const Thing = require('Grow.js');

// A rough GrowFile example... first draft, it's crude.
module.exports = new Thing({
	properties: {
		name: "Grow File example",
		version: '0.1.0',
		
		// todo, register event listeners for these.
		alerts: {
			temperature: {
				// F
				min: 60,
				max: 80
			},
			ph: {
				min: 5.7,
				max: 6.5
			},
			humidity: {
				// percent
				min: 40,
				max: 65
			},
		},

		// GROW ROOM HUMIDITY: 51-61% during vegetative phase; 51 to 59% during flowering.
		// cycles can be an optionally inside of phases.

		// 900-1600 parts per million during lights-on cycle.
		// Natural C02 levels are approximately 387 ppm.

		// Your C02 emitter should be timed in relation to exhaust fan so that C02 is not sucked out of room.

		// phases: vegetative || flowering
		phases: {
			vegetative: {
				cycles: {
					day: {
						start: 'after 6:00am',
						targets: {
							temperature: 24,
							co2: {
								min: 900,
								max: 1600
							}
						}
					},
					night: {
						start: 'after 9:00pm',
						targets: {
							temperature: 20,
						}
					}
				}
			},
			bloom: {
				cycles: {
					day: {
						start: 'after 7:00am',
						targets: {
							temperature: 24
						}
					},
					night: {
						start: 'after 7:00pm',
						targets: {
							temperature: 20,
							co2: 400
						}
					}
				}
			}
		}
	}
});
