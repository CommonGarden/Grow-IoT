const Grow = require('Grow.js');
const ascii = require('ascii-codes');
const http = require('http');
const url = require('url');
const raspio = require('raspi-io');
const five = require('johnny-five');
const later = require('later');
const Hs100Api = require('hs100-api');
const _ = require('underscore');
const NodeWebcam = require('node-webcam');
const fs = require('fs');

const opts = {
    width: 1280,
    height: 720,
    delay: 0,
    quality: 100,
    output: 'jpeg',
    verbose: true
};

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

    var multi = new five.Multi({
        controller: 'BME280'
    });

    var growHub = new Grow({
        uuid: 'meow',
        token: 'meow',
        component: 'GrowHub',

        properties: {
            light_state: null,
            duration: 2000,
            interval: 6000,
            growfile: {
                targets: {
                    ph: {
                        min: 5.9,
                        max: 7.5
                    },
                    ec: {
                        min: 200,
                        max: 1500
                    },
                    temperature: {
                        min: 10,
                        max: 25
                    },
                    humidity: {
                        min: 10,
                        max: 80
                    },
                }
            },
            targets: {},
        },

        start: function () {
            console.log('Grow-Hub initialized.');

            // This must be called prior to any I2C reads or writes.
            // See Johnny-Five docs: http://johnny-five.io
            board.i2cConfig();

            board.i2cRead(0x64, 32, function (bytes) {
                let eC = Grow.parseAtlasEC(bytes);
                if (eC) eC_reading = eC;
            });

            board.i2cRead(0x63, 7, function (bytes) {
                let pH = Grow.parseAtlasPH(bytes);
                if (pH) pH_reading = pH;
            });

            // board.i2cRead(0x66, 7, function (bytes) {
            //   let temp = Grow.parseAtlasTemperature(bytes);
            //   if (temp) water_temp = temp;
            // });

            // var client = new Hs100Api.Client();

            // client.startDiscovery().on('plug-new', (plug) => {
            //   if (plug.name === 'Plant Light') {
            //     console.log('Light connected');
            //     this.light = plug;
            //     this.light.getInfo().then((data)=> {
            //       if (data.sysInfo.relay_state === 1) {
            //         this.set('light_state', 'on');
            //       } else {
            //         this.set('light_state', 'off');
            //       }
            //     }).catch(
            //       (reason) => {
            //         console.log('Handle rejected promise ('+reason+') here.');
            //       }
            //     );
            //   }
            // });


            var interval = this.get('interval');

            emit_data = setInterval(()=> {
                this.temp_data();
                this.hum_data();
                // this.light_data();
                this.ph_data();
                this.ec_data();
                // this.water_temp_data();
                // this.power_data();
            }, interval);

            let growfile = this.get('growfile');
            this.registerTargets(growfile.targets);
            // this.parseCycles(growfile.cycles);
        },

        stop: function () {
            clearInterval(emit_data);
            this.removeAllListeners();
            this.removeTargets();
        },

        restart: function () {
            this.stop();
            this.start();
        },
    
        // day: function () {
        //   console.log('It is day!');
        //   this.call('turn_light_on');
        // },

        // night: function () {
        //   console.log('It is night!');
        //   this.call('turn_light_off');
        // },

        // // Note, there are probably more elegant ways of handling subthing methods.
        // turn_light_on: function () {
        //   console.log('Light on');
        //   if (this.light) {
        //     this.light.setPowerState(true);
        //   }          
        //   this.set('light_state', 'on');
        // },

        // turn_light_off: function () {
        //   console.log('Light off');
        //   if (this.light) {
        //     this.light.setPowerState(false);
        //   }          
        //   this.set('light_state', 'off');
        // },

        picture: function () {
            NodeWebcam.capture( 'image', opts, ( err, data )=> {
                if ( !err ) console.log( 'Image created!' );
                fs.readFile('./' + data, (err, data) => {
                    if (err) throw err; // Fail if the file can't be read.
                    this.sendImage(data);
                });
            });
        },

        // power_data: function () {
        //   this.light.getInfo().then((data)=> {
        //     let powerData = data.consumption.get_realtime;
        //     this.emit('light_power_current', powerData.current);
        //     this.emit('light_power_voltage', powerData.voltage);
        //     this.emit('light_power_power', powerData.power);
        //     this.emit('light_power_total', powerData.total);
        //   });
        // },

        ec_data: function () {
            // Request a reading, 
            board.i2cWrite(0x64, [0x52, 0x00]);

            if (eC_reading) {
                this.emit('ec', eC_reading);

                console.log('Conductivity: ' + eC_reading);
            }
        },

        ph_data: function () {
            // Request a reading
            board.i2cWrite(0x63, [0x52, 0x00]);

            if (pH_reading) {
                this.emit('ph', pH_reading);

                console.log('ph: ' + pH_reading);
            }
        },

        // water_temp_data: function () {
        //   // Request a reading
        //   board.i2cWrite(0x66, [0x52, 0x00]);

        //   if (water_temp) {
        //     this.emit('water_temperature', water_temp);

        //     console.log('Resevoir temp: ' + water_temp);
        //   }
        // },

        // light_data: function () {
        //   this.emit('lux', lux.level);
      
        //   console.log('Light: ' + lux.level);
        // },

        temp_data: function () {
            var currentTemp = multi.thermometer.celsius;

            this.emit('temperature', currentTemp);

            console.log('Temperature: ' + currentTemp);
        },

        hum_data: function () {
            var currentHumidity = multi.hygrometer.relativeHumidity;

            this.emit('humidity', currentHumidity);

            console.log('Humidity: ' + currentHumidity);
        }
    });

    growHub.connect({
        host: '10.0.0.198',
        port: 3000
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
