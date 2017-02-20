const Thing = require('../dist/Thing.es6.js');

// Lets import a few things!
const heater = require('./things/software-heater');
const tempSensor = require('./things/temp-sensor');
const light = require('./things/light');
const plant = require('./things/plant');

const growRoom = new Thing({
	// Subthings are added as properties on a new thing object.
	heater: heater,
	tempSensor: tempSensor,
	light: light,
	plant: plant,

	// These can be updated by the API.
	properties: {
		temp: null,
	},

	initialize: function () {
		console.log("Grow room initialized.");

		// If in the Day cycle, the light should be on.
		this.light.call('turn_on');

		// Read temp sensor every 3 seconds.
		this.interval = setInterval(()=> {
			this.set('temp', this.tempSensor.call('read'));
			console.log(this.get('temp'));
			this.checkTemp();
		}, 3000);
	},

	checkTemp: function () {
		let heaterState = this.heater.get('state');
		let targetTemp = this.plant.get('target_day_temp');
		let currentTemp = this.get('temp');

		// One could also implement this with a PID controller.
		if (currentTemp < targetTemp) {
			// Turn on heater if it isn't already
			if (heaterState === 'off') {
				this.heater.call('turn_on');
			}

			// If the heater is on we increment the temp sensor
			if (heaterState === 'on') {
				this.tempSensor.call('tempUp');
			}
		} else {
			// Turn off heater if it isn't already.
			if (heaterState === 'on') {
				this.heater.call('turn_off');
			}

			// If the heater is off we decrement the temp sensor
			if (heaterState === 'off') {
				this.tempSensor.call('tempDown');
			}
		}
	},

	wrapup: function () {
		this.removeAllListeners();
		clearInterval(this.interval);
		console.log('Grow Room stopped.');
	}
});
