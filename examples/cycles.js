const Thing = require('../dist/Thing.es6.js');
const _ = require('underscore');

// Lets import a few things!
const heater = require('./things/heater');
const tempSensor = require('./things/temp-sensor');
const waterpump = require('./things/waterpump');
const light = require('./things/light');
const later = require('later');

// Use local time, not UTC.
later.date.localTime();

const growRoom = new Thing({
	type: 'environment',
	heater: heater,
	tempSensor: tempSensor,
	light: light,
	waterpump: waterpump,

	properties: {
		targets: {},
		growfile: {
			name: "Grow File example",
			version: '0.1.0',

			// Alerts should fire if the thing emits an event with a value out of bounds
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
	},

	day: function () {
		console.log('It is day!');
        console.log(this.get('targets'))
        light.call('turn_on');
        // waterpump.call('turn_on');
	},

	night: function () {
		console.log('It is night!');
		console.log(this.get('targets'))
        light.call('turn_off');
	},

	// Move to grow.js?
	parseCycles: function(cycles) {
	    _.each(cycles, (list, iteratee)=> {
			let scheduledTime = later.parse.text(String(cycles[iteratee].start));
	        return later.setTimeout(()=> {
	        	try {
	        		if (cycles[iteratee].targets) {
	        			this.set('targets', cycles[iteratee].targets);
	        		}

	        		if(cycles[iteratee].options) {
	        			this.call(iteratee, cycles[iteratee].options);
	        		} else {
	        			console.log(iteratee);
	        			this.call(iteratee);
	        		}
	        	} catch (error) {
	        		console.log(error);
	        	}
	        }, scheduledTime);
	    });
	},

	initialize: function () {
		console.log("Grow room initialized");

		// light.c/all('turn_off');
		waterpump.call('turn_off');

		let growfile = this.get('growfile');

		this.parseCycles(growfile.cycles);

		// Read temp sensor every 3 seconds.
		this.interval = setInterval(()=> {
					waterpump.call('turn_off');

			this.checkTemp();
		}, 3000);
	},

	checkTemp: function () {
		let heaterState = heater.get('state');
		let targets = this.get('targets');
		let currentTemp = tempSensor.call('read');

		console.log('Current temp: ' + currentTemp);

		// One could also implement this with a PID controller.
		if (currentTemp < targets.temperature) {
			// Turn on heater if it isn't already
			if (heaterState === 'off') {
				heater.call('turn_on');
			}

			// If the heater is on we increment the temp sensor
			if (heaterState === 'on') {
				tempSensor.call('tempUp');
			}
		} else {
			// Turn off heater if it isn't already.
			if (heaterState === 'on') {
				heater.call('turn_off');
			}

			// If the heater is off we decrement the temp sensor
			if (heaterState === 'off') {
				tempSensor.call('tempDown');
			}
		}
	},

	wrapup: function () {
		this.removeAllListeners();
		clearInterval(this.interval);
		console.log('Grow Room stopped.');
	}
});

setTimeout(function() {
	growRoom.wrapup();
}, 30000)
