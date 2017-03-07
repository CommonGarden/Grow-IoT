const Thing = require('../dist/Thing.es6.js');

// Lets import a few things!
const heater = require('./things/heater');
const tempSensor = require('./things/temp-sensor');
const waterpump = require('./things/waterpump');
const light = require('./things/light');
const growfile = require('./things/plant');
const later = require('later');

// Use local time, not UTC.
later.date.localTime();

const growRoom = new Thing({
	type: 'environment',
	heater: heater,
	tempSensor: tempSensor,
	light: light,
	growfile: growfile,
	waterpump: waterpump,

	properties: {
		targets: {}
	},

	initialize: function () {
		console.log("Grow room initialized");

		console.log("Day starts: " + growfile.get('cycles').day.start);
		console.log("Night starts: " + growfile.get('cycles').night.start);

		var day_time = later.parse.text(String(growfile.get('cycles').day.start));
        var night_time = later.parse.text(String(growfile.get('cycles').night.start));

        // Todo: determine if it is day or night.
        var now = new Date();

        // The day cycle
        day_timer = later.setTimeout(()=> {
        	console.log('Currently day');
        	this.set('targets', growfile.get('cycles').day.targets);
            light.call('turn_on');
        }, day_time);

        night_timer = later.setTimeout(()=> {
        	console.log('Currently night');
        	this.set('targets', growfile.get('cycles').night.targets);
            light.call('turn_off');
        }, night_time);

		// Read temp sensor every 3 seconds.
		this.interval = setInterval(()=> {
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
