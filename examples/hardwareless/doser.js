// A grow object template for a ph balancer and nutrient doser

// Import the grow.js library.
var GrowInstance = require('../.././dist/Grow.umd.js');

// Declare need variable for example
var currentpHValue;

// Create a new grow instance. Connects by default to localhost:3000
// Create a new grow instance.
var grow = new GrowInstance({
    name: 'Dr. Dose', // The display name for the thing.
    desription: 'Let Dr. Dose manage your hydroponic water resevoir. It keeps your pH balanced and nutrients at optimal levels.',

    // The username of the account you want this device to be added to.
    username: 'jake2@gmail.com',

    // Properties can be updated by the API
    properties: {
        state: 'off'
    },

    // Actions are the API of the thing.
    actions: {
        acid: {
            name: 'Dose acid', // Display name for the action
			duration: 2000,
            function: function () {
            	// Todo: dosing function
            	return;
            }

        },
        base: {
            name: 'Dose base',
			duration: 2000,
            function: function () {
            	// Todo: dosing function
            	return;
            }
        },
        circulate: {
            name: 'Circulate',
            duration: 20000,
            function: function () {
                // Todo: dosing function
                return;
            }
        },
        ph_data: {
            name: 'Log ph data',
            type: 'pH',
            template: 'sensor',
            schedule: 'every 1 second',
            function: function () {
                currentpHValue = Math.random() * 10;

                // Send data to the Grow-IoT app.
                grow.log({
                  type: 'pH',
                  value: currentpHValue
                });
            }
        }
    },
    events: {
        check_ph: {
            name: 'Check pH',
            on: 'ph_data',
            state: null,
            min: 6.2,
            max: 6.5,
            function: function () {
                var min = grow.get('min', 'check_ph');
                var max = grow.get('max', 'check_ph');
                var state = grow.get('state', 'check_ph');
                if (currentpHValue < min && state !== 'low') {
                    grow.emitEvent('pH low')
                        .set('state', 'low', 'check_ph');
                } else if (currentpHValue > max && state !== 'low') {
                    grow.emitEvent('pH high')
                        .set('state', 'low', 'check_ph');
                } else if (currentpHValue > min && currentpHValue < max) {
                    grow.set('state', null, 'check_ph');
                }
            }
        },
        pH_low: {
            name: 'pH low',
            on: 'pH low',
            function: function () {
                grow.call('base').call('circulate');
            }
        },
        pH_high: {
            name: 'pH high',
            on: 'pH high',
            function: function () {
                grow.call('acid').call('circulate');
            }
        }
    }
});

