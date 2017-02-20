const Thing = require('../dist/Thing.es6.js');

// Lets import a few things!
const heater = require('./things/software-heater');
const tempSensor = require('./things/temp-sensor');
const light = require('./things/light');
const plant = require('./things/plant');

const growRoom = new Thing({
	// Include subthings in the config object to make the recognizable by Grow-IoT
	heater: heater,
	tempSensor: tempSensor,
	light: light,
	plant: plant,

	initialize: function () {
		console.log("Grow room initialized");

		// Turn on light
		light.call('turn_on');

		// Read temp sensor every 3 seconds.
		this.interval = setInterval(()=> {
			this.checkTemp();
		}, 3000);
	},

	checkTemp: function () {
		let heaterState = heater.get('state');
		let targetTemp = plant.get('target_day_temp');
		let currentTemp = tempSensor.call('read');

		console.log('Current temp: ' + currentTemp);

		// One could also implement this with a PID controller.
		if (currentTemp < targetTemp) {
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
