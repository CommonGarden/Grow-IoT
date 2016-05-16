const GrowInstance = require('grow.js');
const tessel = require('tessel');
const climatelib = require('climate-si7020');

// Setup pins / modules for Tessel 2 Board
// Docs: https://tessel.io/docs/communicationProtocols#gpio
var light_sensor = tessel.port.B.pin[2];
// var lightswitch = tessel.port.B.pin[3];
var waterpump = tessel.port.B.pin[4];
var ph_sensor_analog = tessel.port.B.pin[5];
var ec_sensor_analog = tessel.port.B.pin[6];
var climate = climatelib.use(tessel.port['A']);

// Connects by default to localhost:3000
var grow = new GrowInstance({
    "name": "Tessel 2 Smart Pot", // Maybe "displayname"? https://github.com/npm/npm/issues/3105
    "version": "0.1.5", // This should just be in package.json
    "board": "tessel-2", // Better way to identify this?
    "description": "A self watering, light controlling, sensor equipped smart pot.",
    "owner": "jake@commongarden.org",
    "components": [
        {
            "name": "Light sensor",
            "type": "light",
            "template": "sensor",
            "controller": "analog",
            "data": [
                {
                    "name": "Log light data",
                    "id": "log_light_data",
                    "schedule": "every 1 second",
                    "function": function () {
                        light_sensor.analogRead(function(error, value) {
                          // print the pin value to the console
                          console.log("light: " + value);
                        });
                    }
                }
            ]
        },
        // {
        //     "name": "Ph sensor",
        //     "type": "ph",
        //     "template": "sensor",
        //     "controller": "analog",
        //     "data": [
        //         {
        //             "name": "Log ph data",
        //             "id": "log_ph_data",
        //             "schedule": "every 1 second",
        //             "function": function () {
        //                 ph_sensor_analog.analogRead(function(error, value) {
        //                   // print the pin value to the console
        //                   console.log("ph: " + value);
        //                 });                    }
        //         }
        //     ]
        // },
        // {
        //     "name": "temperature sensor",
        //     "type": "temperature",
        //     "template": "sensor",
        //     "controller": "climate-si7020", // Name of the NPM package.
        //     "data": [
        //         {
        //             "name": "Log temperature data",
        //             "id": "log_temperature_data",
        //             "schedule": "every 1 second",
        //             "function": function () {
        //                 climate.readTemperature('f', function(err, temp){
        //                     console.log('Degrees:', temp.toFixed(4) + 'F';
        //                 });
        //             }
        //         }
        //     ]
        // },
        // {
        //     "name": "humidity sensor",
        //     "type": "humidity",
        //     "template": "sensor",
        //     "controller": "climate-si7020", // Name of the NPM package.
        //     "data": [
        //         {
        //             "name": "Log humidity data",
        //             "id": "log_humidity_data",
        //             "schedule": "every 1 second",
        //             "function": function () {
        //                 climate.readHumidity(function(err, humid){
        //                     console.log("humidity: " + humid.toFixed(4));
        //                 }    
        //             }
        //         }
        //     ]
        // },
        {
            "name": "Light",
            "type": "relay",
            "template": "actuator",
            "state": "off",
            "actions": [
                {
                    "name": "On",
                    "id": "turn_light_on",
                    "updateState": "on",
                    "schedule": "at 9:00am",
                    "event": "Light turned on",
                    "function": function () {
                        lightswitch.output(1);
                        console.log("Light on");
                    }
                },
                {
                    "name": "off",
                    "id": "turn_light_off",
                    "updateState": "off",
                    "schedule": "at 8:30pm",
                    "event": "Light turned off",
                    "function": function () {
                        lightswitch.output(0);
                        console.log("light off");
                    }
                }
            ]
        },
        {
            "name": "Water plant",
            "type": "waterpump",
            "template": "actuator",
            "state": "off",
            "actions": [
                {
                    "name": "Water plant",
                    "id": "water_plant",
                    "updateState": "watering",
                    "schedule": "at 9:00am",
                    "event": "Light turned on",
                    "options": {
                        "duration": "20 seconds"
                    },
                    "function": function (options) {
                        console.log("watering");
                        waterpump.output(1);
                        setTimeout(()=> {
                            waterpump.output(0);
                        }, options.duration);
                        // TODO update state for off and support options.
                    }
                }
            ]
        }
    ]
}, () => {
    // Optional callback function.
    climate.on('error', (err) => {
      this.emitEvent('error connecting module', err);
    });
});
