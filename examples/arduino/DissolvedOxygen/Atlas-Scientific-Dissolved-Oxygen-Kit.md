# Atlas Scientific Dissolved Oxygen Sensor

* [Product page](https://www.atlas-scientific.com/product_pages/kits/do_kit.html)
* [Documentation](http://atlas-scientific.com/_files/_datasheets/_circuit/DO_EZO_Datasheet.pdf)

### Johnny-Five + Grow.js example
```javascript
// Require the Grow.js build and johnny-five library.
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
        name: 'Disolved Oxygen sensor', // The display name for the thing.
        desription: 'Atlas Scientific Disolved Oxygen sensor',
        username: 'jake2@gmail.com', // The username of the account you want this device to be added to.
        properties: {},
        actions: {
            log_do_data: {
                name: 'Disolved Oxygen Sensor', 
                template: 'sensor',
                type: 'D.O.', // Currently needed for visualization component... HACK.
                schedule: 'every 1 second',
                function: function () {
                    // Request a reading
                    board.i2cWrite(0x61, [0x52, 0x00]);
                    // Read response.
                    board.i2cRead(0x61, 0x00, 14, function (bytes) {
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

                    // // Send value to Grow-IoT
                    grow.sendData({
                      type: 'D.O.',
                      value: DO_reading
                    });
                }
            }
        },
        events: {
            check_do_data: {
                name: 'Check D.O. data',
                on: 'log_do_data', // Adds Listener for action event.
                function: function () {
                    // TODO emit an event if the oxygen is too low
                    return;
                }
            }
        }
    });
});
```


