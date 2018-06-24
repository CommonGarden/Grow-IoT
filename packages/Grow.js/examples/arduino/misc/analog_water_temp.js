'use strict';

// Break this out into separate repo.
const Grow = require('Grow.js');
const five = require('johnny-five');
const spawn = require('child_process').spawn;

// Create a new board object
const board = new five.Board();

// When board emits a 'ready' event run this start function.
board.on('ready', function start() {
    var data_interval,
        water_temp;

    // This requires OneWire support using the ConfigurableFirmata
    var thermometer = new five.Sensor('A0');

    thermometer.on('change', function(value) {
        console.log(value);
    // water_temp = this.celsius;
    });

    // Create a new grow instance and connect to https://grow.commongarden.org
    var grow = new Grow({
        uuid: 'meow',
        token: 'meow',

        component: 'Thermostat',

        // Properties can be updated by the API
        properties: {
            state: 'off',
            growfile: {
                temperature: {
                    min: 22,
                    ideal: 27,
                    max: 29,
                    pid: {
                        k_p: 300,
                        k_i: 0,
                        k_d: 200,
                        dt: 1
                    }
                },
            },
            interval: 1000,
            threshold: 0.2,
        },

        start: function () {
            var interval = this.get('interval');
            data_interval = setInterval(()=> {
                this.temp_data();
            }, interval);

            var growfile = this.get('growfile');
            this.registerTargets(growfile);

            var threshold = this.get('threshold');

            // Listen for correction events from our PID controller
            this.on('correction', (key, correction) => {
                console.log(correction);
                if (Math.abs(correction) > threshold) {
                    if (key === 'temperature') {
                        if (correction > 0) {
                            this.call('turn_on');
                        } else {
                            this.call('turn_off');
                        }
                    }
                }
            });
        },

        stop: function () {
            clearInterval(data_interval);
            this.removeAllListeners();
        },

        restart: function () {
            this.stop();
            this.removeTargets();
            this.start();
        },

        // Note, there are probably more elegant ways of handling subthing methods.
        turn_on: function () {
            console.log('Heater on');
            // var process = spawn('dlipower', ['--hostname', '192.168.0.100', '--user', 'admin', '--password', '1234', 'on', '4']);
            this.set('state', 'on');
        },

        turn_off: function () {
            console.log('Heater off');
            // var process = spawn('dlipower', ['--hostname', '192.168.0.100', '--user', 'admin', '--password', '1234', 'off', '4']);
            this.set('state', 'off');
        },

        temp_data: function () {
            grow.emit('temperature', water_temp);

            console.log('temperature: ' + water_temp);
        }
    });

    grow.connect({
        host: '10.0.0.198'
    });

});
