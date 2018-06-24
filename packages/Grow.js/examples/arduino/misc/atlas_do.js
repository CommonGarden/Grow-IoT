// See https://github.com/CommonGarden/Grow-IoT/wiki/Atlas-Scientific-Dissolved-Oxygen-Kit
var GrowInstance = require('Grow.js');
var five = require('johnny-five');
var ascii = require('ascii-codes');

// Create a new board object
var board = new five.Board();

// When board emits a 'ready' event run this start function.
board.on('ready', function start() {
    // This must be called prior to any I2C reads or writes.
    this.i2cConfig();

    var DO_reading;

    // Create a new grow instance.
    var grow = new GrowInstance({
        properties: {
            min: {
                type: Number,
                value: 5.5
            }
        },

        start: function () {
            // Read response.
            board.i2cRead(0x61, 14, function (bytes) {
                var bytelist = [];
                if (bytes[0] === 1) {
                    for (i = 0; i < bytes.length; i++) {
                        if (bytes[i] !== 1 && bytes[i] !== 0) {
                            bytelist.push(ascii.symbolForDecimal(bytes[i]));
                        }
                    }
                    DO_reading = bytelist.join('');
                }
            });

            setInterval(()=> {
                this.log_do_data();
            }, 3000);
        },
    
        log_do_data: function () {
            // Request a reading
            board.i2cWrite(0x61, [0x52, 0x00]);

            console.log(DO_reading);
      
            // // Send value to Grow-IoT
            grow.emit({
                type: 'D.O.',
                value: DO_reading
            });
        }
    });
});