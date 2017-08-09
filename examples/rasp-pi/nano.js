// Require the Grow.js build and johnny-five library.
const Thing = require('../../dist/Grow.js');
const five = require('johnny-five');
const later = require('later');
const Hs100Api = require('hs100-api');

// Use local time, not UTC.
later.date.localTime();

// See http://johnny-five.io/ to connect devices besides arduino.
const nano = new five.Board();

// When board emits a 'ready' event run this start function.
nano.on('ready', function start() {
  // Define variables
  var one = new five.Pin(6),
    two = new five.Pin(7),
    three = new five.Pin(8),
    four = new five.Pin(9);

  one.high();
  two.high();
  three.high();
  four.high();

  // This requires OneWire support using the ConfigurableFirmata
  var thermometer1 = new five.Thermometer({
    controller: "DS18B20",
    pin: 4
  });

  var thermometer2 = new five.Thermometer({
    controller: "DS18B20",
    pin: 5
  });

  thermometer1.on("change", function() {
    console.log(this.celsius + "°C");
    // console.log("0x" + this.address.toString(16));
  });

  thermometer2.on("change", function() {
    console.log(this.celsius + "°C");
    // console.log("0x" + this.address.toString(16));
  });
});
