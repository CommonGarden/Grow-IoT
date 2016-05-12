var GrowInstance = require('../../.././grow.js');
// var tessel = require('tessel');s

// Connects by default to localhost:3000
var grow = new GrowInstance({
    "name": "Tessel 2 Smart Pot",
    "version": "0.1.5",
    "description": "A self watering, light controlling, sensor equipped smart pot.",
    "owner": "jake@commongarden.org",
    "components": [
        {
            "name": "Light sensor",
            "type": "light",
            "template": "sensor",
            "controller": "analog",
            "actions": [
                {
                    "name": "Log light data",
                    "id": "log_light_data",
                    "schedule": "every 1 second",
                    "function": function () {
                        console.log("light");
                    }
                }
            ]
        },
        {
            "name": "Ph sensor",
            "type": "ph",
            "template": "sensor",
            "controller": "analog",
            "actions": [
                {
                    "name": "Log ph data",
                    "id": "log_ph_data",
                    "schedule": "every 1 second",
                    "function": function () {
                        console.log("ph");
                    }
                }
            ]
        },
        {
            "name": "temperature sensor",
            "type": "temperature",
            "template": "sensor",
            "controller": "analog",
            "actions": [
                {
                    "name": "Log temperature data",
                    "id": "log_temperature_data",
                    "schedule": "every 1 second",
                    "function": function () {
                        console.log("temperature");
                    }
                }
            ]
        },
        {
            "name": "humidity sensor",
            "type": "humidity",
            "template": "sensor",
            "controller": "analog",
            "actions": [
                {
                    "name": "Log humidity data",
                    "id": "log_humidity_data",
                    "schedule": "every 1 second",
                    "function": function () {
                        console.log("humidity");
                    }
                }
            ]
        },
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
                    "function": function () {
                        console.log("watering");
                        // TODO update state for off and support options.
                    }
                }
            ]
        }
    ]
});
