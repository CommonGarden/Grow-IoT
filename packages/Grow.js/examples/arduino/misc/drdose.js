// Break this out into separate repo.
const Grow = require('Grow.js');
const five = require('johnny-five');

// Create a new board object
const board = new five.Board();

// When board emits a 'ready' event run this start function.
board.on('ready', function start() {

    var pH_reading,
        eC_reading,
        data_interval,
        water_temp,
        acidpump = new five.Pin(4),
        basepump = new five.Pin(5),
        ph_power = new five.Pin(12),
        ph_sensor = new five.Sensor('A1');

    // This requires OneWire support using the ConfigurableFirmata
    let thermometer = new five.Thermometer({
        controller: 'DS18B20',
        pin: 3
    });

    thermometer.on('change', function() {
    // console.log(this.celsius + "°C");
        water_temp = this.celsius;
    });

    ph_power.high();

    // Hack: Relays are inversed... make sure pumps are off.
    // Better hardware could take care of this... I'm not an electrical engineer.
    acidpump.high();
    basepump.high();

    // Create a new grow instance and connect to https://grow.commongarden.org
    var grow = new Grow({
        uuid: 'meow',
        token: 'meow',

        component: 'DrDose',

        // Properties can be updated by the API
        properties: {
            growfile: {
                ph: {
                    min: 7.0,
                    // ideal: 7.15,
                    max: 7.3,
                    pid: {
                        k_p: 0.25,
                        k_i: 0.01,
                        k_d: 0.01,
                        dt: 1
                    }
                },
            },
            interval: 1000,
            threshold: 0.2,
        },

        start: function () {
            let interval = this.get('interval');
            data_interval = setInterval(()=> {
                this.ph_data();
                this.temp_data();
            }, interval);

            let growfile = this.get('growfile');
            this.registerTargets(growfile);

            let threshold = this.get('threshold');

            ph_sensor.on('change', (value)=> {
                pH_reading = this.parseAnalogpH(value);
            });

            // Listen for correction events from our PID controller
            this.on('correction', (key, correction) => {
                console.log(correction);
                if (Math.abs(correction) > threshold) {
                    if (key === 'ph') {
                        if (correction < 0) {
                            this.call('acid', Math.abs(correction) * 1000);
                        } else {
                            this.call('base', correction * 1000);
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

        acid: function (duration) {
            acidpump.low();

            setTimeout(function () {
                acidpump.high();
            }, duration);
        },
    
        base: function (duration) {
            basepump.low();

            setTimeout(function () {
                basepump.high();
            }, duration);
        },

        ph_data: function () {
            // Request a reading
            // Send data to the Grow-IoT app.
            this.emit('ph', pH_reading);

            console.log('ph: ' + pH_reading);
        },

        temp_data: function () {
            // Request a reading
            if (water_temp) {
                // Send data to the Grow-IoT app.
                this.emit('temperature', water_temp);

                console.log('Temperature: ' + water_temp);
            }
        }
    }).connect();
});
