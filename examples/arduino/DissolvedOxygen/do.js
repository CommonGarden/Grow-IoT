// Require the Grow.js build and johnny-five library.
var GrowInstance = require('../../../dist/Grow.umd.js');
var five = require('johnny-five');

// Break this out into Atlas Scientific helpers...
const symbolIndex = [
    "NUL",
    "SOH",
    "STX",
    "ETX",
    "EOT",
    "ENQ",
    "ACK",
    "BEL",
    "BS",
    "TAB",
    "LF",
    "VT",
    "FF",
    "CR",
    "SO",
    "SI",
    "DLE",
    "DC1",
    "DC2",
    "DC3",
    "DC4",
    "NAK",
    "SYN",
    "ETB",
    "CAN",
    "EM",
    "SUB",
    "ESC",
    "FS",
    "GS",
    "RS",
    "US",
    " ",
    "!",
    "\"",
    "#",
    "$",
    "%",
    "&",
    "'",
    "(",
    ")",
    "*",
    "+",
    ",",
    "-",
    ".",
    "/",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    ":",
    ";",
    "<",
    "=",
    ">",
    "?",
    "@",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "[",
    "\\",
    "]",
    "^",
    "_",
    "`",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "{",
    "|",
    "}",
    "~"
];

const symbolForDecimal = function (n) {
    return symbolIndex[n];
}

// Create a new board object
var board = new five.Board();

// When board emits a 'ready' event run this start function.
board.on('ready', function start() {
    // This must be called prior to any I2C reads or writes.
    this.i2cConfig();

    // Create a new grow instance.
    var grow = new GrowInstance({
        name: 'Disolved Oxygen sensor', // The display name for the thing.
        desription: 'Atlas Scientific Disolved Oxygen sensor',
        username: 'jake2@gmail.com', // The username of the account you want this device to be added to.
        properties: {
            state: 'off'
        },
        actions: {
            do_data: {
                name: 'Log D.O. data', 
                type: 'd.o.', // Currently need for visualization component... HACK.
                template: 'sensor',
                schedule: 'every 1 second',
                function: ()=> {
                    // Request a reading
                    this.i2cWrite(0x61, [0x52, 0x00]);
                    // Read response.
                    let reading = this.i2cRead(0x61, 14, function(bytes) {
                        if (bytes[0] === 1) {
                            let reading = [];
                            for (i = 0; i < bytes.length; i++) {
                                if (bytes[i] !== 1 && bytes[i] !== 0) {
                                    reading.push(symbolForDecimal(bytes[i]));
                                }
                            }
                            return reading.join('');
                        }
                    });
                    // Send value to Grow-IoT
                    grow.sendData({
                      type: 'D.O.',
                      value: reading
                    });
                }
            }
        },
        events: {
            check_do_data: {
                name: 'Check D.O. data',
                on: 'do_data', // Adds Listener for action event.
                function: function () {
                    return;
                }
            }
        }
    });
});
