const GrowBot = require('Grow.js');
const tessel = require('tessel');
const ascii = require('ascii-codes');
const http = require('http');

// The idea here is you have a dynamic document that can data bind to a web component
// Consider this ES6 psuedo code.
const grow = new GrowBot({
  is: 'dr-dose',
  properties: {
    name: {
      type: String,
      value: 'Dr. Dose'
    },
    description: {
      type: String,
      value: 'Dr. Dose will keep your pH balanced.'
    },
    owner_email: {
      type: String,
      value: 'jake.hartnell@gmail.com',
      readonly: true
    },
    state: {
      type: String,
      value: null,
      readonly: true
    },
    decision_buffer: {
      type: Number,
      value: 100
    },
    // Outputs are readonly
    pH_reading: {
      type: Number,
      value: null,
      readonly: true
    }
  },

  // Run on Growbot construction
  setup: () => {
    // Todo: setup I2C or UART interface with atlas scientific sensors.
    
    const acidpump = tessel.port.B.pin[7];
    const basepump = tessel.port.B.pin[6];

    // Relays are inversed.
    acidpump.high();
    basepump.high();
  },

  acid: () => {
    acidpump.low();

    let duration = grow.get('duration');
    setTimeout(function () {
      acidpump.high();
    }, duration);
  },


  base: () => {
    basepump.low();

    let duration = grow.get('duration');
    setTimeout(function () {
      basepump.high();
    }, duration);
  },

  read_Ph: () => {
    // Request a reading
    tessel.i2cWrite(0x63, [0x52, 0x00]);

    // Read response.
    tessel.i2cRead(0x63, 7, function (bytes) {
      let bytelist = [];
      if (bytes[0] === 1) {
        for (i = 0; i < bytes.length; i++) {
          if (bytes[i] !== 1 && bytes[i] !== 0) {
            bytelist.push(ascii.symbolForDecimal(bytes[i]));
          }
        }
        pH_reading = bytelist.join('');
      }
    });

    // return pH_reading;
    // // ???
    this.setProperty('pH_reading', pH_reading);
  }
});

// There are options for how you can choose to connect

// ddp:
// exchanges a json version of the grow config on device registration.
grow.ddpConnect({    
  webcomponent: 'https://github.com/path/to/hosted/html/component/build',
  host: 'grow.commongarden.org',
  tlsOpts: {
    tls: {
      servername: 'galaxy.meteor.com'
    }
  },
  port: 443,
  ssl: true
});

// mqtt
// Connects to an MQTT broker also registers itself as a JSON object.
grow.mqttConnect({    
  webcomponent: 'https://github.com/path/to/hosted/html/component/build',
  host: 'grow.commongarden.org',
  tlsOpts: {
    tls: {
      servername: 'galaxy.meteor.com'
    }
  },
  port: 443,
  ssl: true
});

// Rest example: the device is a server.
// Pass in webcomponent build? index.html?
grow.createServerAndListenOn(8080);
// Maybe just a parseUrl helper method?
var server = http.createServer(function (request, response) {
  if (!grow.parseUrl(request.url)) {
    function showIndex (url, request, response) {
      response.writeHead(200, {'Content-Type': 'text/html'});
      fs.readFile(__dirname + '/index.html', function (err, content) {
        if (err) {
          throw err;
        }

        response.end(content);
      });
    }
  }
});

server.listen(8080);

// Host Tessel in ACCESS Point mode...
console.log('Server running at http://192.168.1.101:8080/');


// API
grow.set('property', 'new value');
grow.get('property');
grow.call('method');
grow.on('event', function() {
  return;
});

// Things are event emitters with a UUID bound to time.
grow.schedule('property', 'valid later.js text expression');
grow.unschedule('read_Ph');

// ??? Possible API ???
// grow.reset(); // Reset the grow instance.
// grow.fire(); // call fire function if it is defined? 

// Get current time from the server so that everyone is on the same schedule.
// Clocks being off is surprisingly common for IoT devices.
// grow.syncClock();
