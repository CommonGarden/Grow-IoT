const Grow = require('Grow.js');
const ascii = require('ascii-codes');
const http = require('http');
const url = require('url');
const raspio = require('raspi-io');
const five = require('johnny-five');
const later = require('later');
const Hs100Api = require('hs100-api');
const growfile = require('../growfiles/cannabis');
const _ = require('underscore');
const Cam = require('./webcam.js');
const Controller = require('node-pid-controller');

// Use local time, not UTC.
later.date.localTime();

// Create a new board object
const board = new five.Board({
    io: new raspio()
});

// When board emits a 'ready' event run this start function.
board.on('ready', function start() {
    // Declare needed variables.
    var pH_reading, eC_reading, water_temp, emit_data;

    var lux = new five.Light({
        controller: 'TSL2561'
    });

    var multi = new five.Multi({
        controller: 'SI7020'
    });

    var growHub = new Grow({
        uuid: '48d7251e-45c2-43b3-84bd-cdac0bd8c412',
        token: '3XMJdsSsTqmxMYjEMzaBtqrGwk7hxozv',
        component: 'GrowHub',

        camera: Cam,

        properties: {
            light_state: null,
            fan_state: null,
            pump_state: null,
            duration: 2000,
            interval: 60000,
            growfile: growfile,
            targets: {},
        },

        start: function () {
            console.log('Grow-Hub initialized.');

            // This must be called prior to any I2C reads or writes.
            // See Johnny-Five docs: http://johnny-five.io
            board.i2cConfig();

            board.i2cRead(0x64, 32, function (bytes) {
                var bytelist = [];
                if (bytes[0] === 1) {
                    // console.log(bytes);
                    for (i = 0; i < bytes.length; i++) {
                        if (bytes[i] !== 1 && bytes[i] !== 0) {
                            bytelist.push(ascii.symbolForDecimal(bytes[i]));
                        }
                    }
                    eC_reading = bytelist.join('');
                }
            });

            board.i2cRead(0x63, 7, function (bytes) {
                var bytelist = [];
                if (bytes[0] === 1) {
                    for (i = 0; i < bytes.length; i++) {
                        if (bytes[i] !== 1 && bytes[i] !== 0) {
                            bytelist.push(ascii.symbolForDecimal(bytes[i]));
                        }
                    }
                    pH_reading = bytelist.join('');
                }
            });

            board.i2cRead(0x66, 7, function (bytes) {
                var bytelist = [];
                if (bytes[0] === 1) {
                    for (i = 0; i < bytes.length; i++) {
                        if (bytes[i] !== 1 && bytes[i] !== 0) {
                            bytelist.push(ascii.symbolForDecimal(bytes[i]));
                        }
                    }
                    water_temp = bytelist.join('');
                }
            });

            var client = new Hs100Api.Client();

            client.startDiscovery().on('plug-new', (plug) => {
                if (plug.name === 'Grow tent light') {
                    console.log('Light connected');
                    this.light = plug;
                    this.light.getInfo().then((data)=> {
                        if (data.sysInfo.relay_state === 1) {
                            this.set('light_state', 'on');
                        } else {
                            this.set('light_state', 'off');
                        }
                    });
                }
                else if (plug.name === 'Water Pump') {
                    console.log('Water pump connected');
                    this.pump = plug;
                    this.pump.getInfo().then((data)=> {
                        if (data.sysInfo.relay_state === 1) {
                            this.set('pump_state', 'on');
                        } else {
                            this.set('pump_state', 'off');
                        }
                    });
                }
                else if (plug.name === 'Fan') {
                    console.log('Fan connected');
                    this.fan = plug;
                    this.fan.getInfo().then((data)=> {
                        if (data.sysInfo.relay_state === 1) {
                            this.set('fan_state', 'on');
                        } else {
                            this.set('fan_state', 'off');
                        }
                    });
                }
            });

            var interval = this.get('interval');

            emit_data = setInterval(()=> {
                this.temp_data();
                this.hum_data();
                this.ph_data();
                this.ec_data();
                this.water_temp_data();
                this.light_data();
                this.power_data();
            }, interval);

            let grow = this.get('growfile');
            this.startGrow(growfile);
        },

        stop: function () {
            clearInterval(emit_data);
        },

        restart: function () {
            let growfile = this.get('growfile');
            // this.removeTargets(growfile.targets);
            // this.start();
        },
    
        day: function () {
            console.log('It is day!');
            this.call('turn_light_on');
            this.call('turn_pump_on');
        },

        night: function () {
            console.log('It is night!');
            this.call('turn_light_off');
            this.call('turn_pump_off');
        },

        // Note, there are probably more elegant ways of handling subthing methods.
        turn_light_on: function () {
            console.log('Light on');
            if (this.light) {
                this.light.setPowerState(true);
            }          
            this.set('light_state', 'on');
        },

        turn_light_off: function () {
            console.log('Light off');
            if (this.light) {
                this.light.setPowerState(false);
            }          
            this.set('light_state', 'off');
        },

        turn_fan_on: function () {
            console.log('Fan on');
            if (this.fan) {
                this.fan.setPowerState(true);
            }
            this.set('fan_state', 'on');
        },

        turn_fan_off: function () {
            console.log('Fan off');
            if (this.fan) {
                this.fan.setPowerState(false);
            }
            this.set('fan_state', 'off');
        },

        turn_pump_on: function () {
            console.log('Pump on');
            if (this.pump) {
                this.pump.setPowerState(true);
            }
            this.set('pump_state', 'on');
        },

        turn_pump_off: function () {
            console.log('Pump off');
            if (this.pump) {
                this.pump.setPowerState(false);
            }
            this.set('pump_state', 'off');
        },

        water: function () {
            let duration = this.get('water_duration');
            this.call('turn_pump_on');
            setTimeout(function(){
                growHub.call('turn_pump_off');
            }, duration);
        },

        power_data: function () {
    	// TODO: for influx db, the power data must be a number not an object...
            this.light.getInfo().then((data)=> {
                let powerData = data.consumption.get_realtime;
                this.emit({
                    type: 'light_power_current',
                    value: powerData.current
                });
                this.emit({
                    type: 'light_power_voltage',
                    value: powerData.voltage
                });
                this.emit({
                    type: 'light_power_power',
                    value: powerData.power
                });
                this.emit({
                    type: 'light_power_total',
                    value: powerData.total
                });
            });

            this.fan.getInfo().then((data)=> {
                let powerData = data.consumption.get_realtime;
                this.emit({
                    type: 'fan_power_current',
                    value: powerData.current
                });
                this.emit({
                    type: 'fan_power_voltage',
                    value: powerData.voltage
                });
                this.emit({
                    type: 'fan_power_power',
                    value: powerData.power
                });
                this.emit({
                    type: 'fan_power_total',
                    value: powerData.total
                });
            });

            this.pump.getInfo().then((data)=> {
                let powerData = data.consumption.get_realtime;
                this.emit({
                    type: 'pump_power_current',
                    value: powerData.current
                });
                this.emit({
                    type: 'pump_power_voltage',
                    value: powerData.voltage
                });
                this.emit({
                    type: 'pump_power_power',
                    value: powerData.power
                });
                this.emit({
                    type: 'pump_power_total',
                    value: powerData.total
                });
            });
        },

        ec_data: function () {
            // Request a reading, 
            board.i2cWrite(0x64, [0x52, 0x00]);

            eC_reading = this.parseEC(eC_reading);

            if (eC_reading) {
                this.emit({
                    type: 'ec',
                    value: eC_reading
                });

                console.log('Conductivity: ' + eC_reading);
            }
        },

        ph_data: function () {
            // Request a reading
            board.i2cWrite(0x63, [0x52, 0x00]);

            if (this.ispH(pH_reading)) {
                this.emit({
                    type: 'ph',
                    value: pH_reading
                });

                console.log('ph: ' + pH_reading);
            }
        },

        light_data: function () {
            this.emit({
                type: 'lux',
                value: lux.level
            });
      
            console.log('Light: ' + lux.level);
        },

        water_temp_data: function () {
            // Request a reading
            board.i2cWrite(0x66, [0x52, 0x00]);

            this.emit({
                type: 'water_temperature',
                value: water_temp
            });

            console.log('Resevoir temp: ' + water_temp);
        },

        temp_data: function () {
            var currentTemp = multi.thermometer.celsius;

            this.emit({
                type: 'temperature',
                value: currentTemp
            });

            console.log('Temperature: ' + currentTemp);
        },

        hum_data: function () {
            var currentHumidity = multi.hygrometer.relativeHumidity;
            this.emit({
                type: 'humidity',
                value: currentHumidity
            });

            console.log('Humidity: ' + currentHumidity);
        }
    });

    growHub.connect({
        host: '10.0.0.198',
    });

    // Default is localhost: 3000
    // growHub.connect({
    //   host: 'grow.commongarden.org',
    //   tlsOpts: {
    //     tls: {
    //       servername: 'galaxy.meteor.com'
    //     }
    //   },
    //   port: 443,
    //   ssl: true
    // });
});
