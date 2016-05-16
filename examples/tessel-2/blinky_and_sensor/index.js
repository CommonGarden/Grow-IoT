const GrowInstance = require('../../../dist/Grow.es6.js');
const tessel = require('tessel');
const climatelib = require('climate-si7020');

var leds = tessel.led;
// ERR - Red
var red = leds[0];
// WLAN - Amber
var amber = leds[1];
// LED0 - Green
var green = leds[2];
// LED1 - Blue
var blue = leds[3];

var climate = climatelib.use(tessel.port['A']);

// Connects by default to localhost:3000
var grow = new GrowInstance({
    name: "Tessel 2 Blinky Climate Sensor", // Maybe "displayname"? https://github.com/npm/npm/issues/3105
    version: "0.1.5", // This should just be in package.json
    board: "tessel-2", // Better way to identify this? Perhaps just link to a board document?
    description: "A simple tessel-2 example.",
    state: "Light is off.",
    useruuid: "", // A uuid to connect devices to your user account on Grow-IoT.
    actions: [
        {
            name: "Temperature sensor", // Logging data is an action
            template: "sensor", // integration with Grow-IoT specific, in the future we might specify web components: http://webcomponents.org/
            id: "log_temperature_data", // An instance specific unique id is required.
            schedule: "every 1 second", // Logs data every second 
            function: function () {
                climate.readTemperature('f', function(err, temp){
                    console.log('Degrees:', temp.toFixed(4) + 'F';
                });
            }
        },
        {
            name: "Humidity sensor",
            type: "humidity",
            template: "sensor", // specifies the template in grow IoT.
            id: "log_humidity_data",
            schedule: "every 1 second",
            function: function () {
                climate.readHumidity(function(err, humid){
                    console.log("humidity: " + humid.toFixed(4));
                }    
            }
        },
        {
            name: "Turn Led on",
            template: "actuator",
            id: "turn_light_on",
            schedule: "at 9:00am",
            event: "Light turned on",
            function: function () {
                lightswitch.output(1);
            }
        },
        {
            name: "off",
            id: "turn_light_off",
            schedule: "at 8:30pm",
            event: "Light turned off",
            function: function () {
                lightswitch.output(0);
            }
        }
    ],
    events: [
        {
            name: "Check humidity",
            id: "check_humidity",
            on: "log_humidity_data",
            function: () => {
                // Todo: if / then.
                return;
            }
        }
    ]
}, () => {
    // Optional callback function.
    climate.on('error', (err) => {
      this.emitEvent('error connecting module', err);
    });
});
