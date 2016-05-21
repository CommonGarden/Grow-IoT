// Require the Grow.js build and johnny-five library.
var GrowInstance = require('../../dist/Grow.umd.js');
var five = require('johnny-five');

// Create a new board object
var board = new five.Board();

// When board is ready run this start function.
board.on("ready", function start() {
    // Define variables
    // Note: if you wire the device slightly differently you may need to
    // change the pin numbers below.
    var LED = new five.Pin(13),
        lightSensor = new five.Sensor("A0");

    // Create a new grow instance.
    var grow = new GrowInstance({
        "name": "Light", // The display name for the thing.
        "id": "Light",
        "desription": "An LED light with a basic on/off api.",
        "state": "off", // The current state of the thing.
        "username": "jakehart", // The username of the account you want this device to be added to.
        "actions": [ // A list of action objects
            {
                "name": "On", // Display name for the action
                "description": "Turns the light on.", // Optional description
                "id": "turn_light_on", // A unique id
                "schedule": "at 9:00am", // Optional scheduling using later.js
                "event": "Light turned on", // Optional event to emit when called.
                "function": function () {
                    // The implementation of the action.
                    LED.high();
                    console.log("Light on.");
                    grow.updateProperty('Light', 'state', 'on');
                }
            },
            {
                "name": "off",
                "id": "turn_light_off",
                "schedule": "at 8:30pm",
                "event": "Light turned off",
                "function": function () {
                    LED.low();
                    console.log("Light off.");
                    grow.updateProperty('Light', 'state', 'off');
                }
            },
            {
                "name": "Log light data", // Events get a display name like actions
                "id": "light_data", // Events also get an id that is unique to the device
                "template": "sensor",
                "schedule": "every 1 second", // Events should have a schedule option that determines how often to check for conditions.
                "function": function () {
                    // function should return the event to emit when it should be emited.
                    // console.log(lightSensor.value);
                    grow.sendData({
                      type: "light",
                      value: lightSensor.value
                    });
                }
            }
        ],
        "events": [
            {
                'name': 'light data is data',
                'id': 'check_light_data',
                'on': 'light_data', // Hook into an action.
                'function': function () {
                    if (lightSensor.value < 50) {
                        // Option to only emit once?
                        grow.emitEvent("It's dark");
                    } else if (lightSensor.value >= 50) {
                        grow.emitEvent("It's light");
                    }
                }
            }
        ]
    });
});
