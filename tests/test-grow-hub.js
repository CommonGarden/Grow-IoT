const Thing = require('Grow.js');
const growfile = require('./grow.js')

// Create a new growHub instance and connect to https://growHub.commongarden.org
const growHub = new Thing({
    uuid: '836a591a-2188-4ee2-a1f0-1fde5e82bf8f',
    token: 'edHeTSJvSLC5RmrRzLTgfjrMDmAaF5ho',
    component: 'grow-hub',

    // Properties can be updated by the API
    properties: {
        state: null,
        duration: 2000,
        interval: 5000,
        targets: {},
    },

    start: function () {
        console.log('Grow-Hub initialized.');

        let interval = this.get('interval');
        
        emit_and_analyze = setInterval(()=> {
            this.temp_data();
            this.hum_data();
            this.ph_data();
            this.ec_data();
        }, interval);

        this.parseCycles(growfile.properties.cycles);
    },

    stop: function () {
        console.log("Grow-Hub stopped.");
        clearInterval(emit_and_analyze);
        clearInterval(light_on_timer);
        clearInterval(light_off_timer);
        this.removeAllListeners();
    },
    
    day: function () {
        console.log('It is day!');
        console.log(this.get('targets'))
    },

    night: function () {
        console.log('It is night!');
        console.log(this.get('targets'))
    },

    ec_data: function () {
        eC_reading = Math.random() * 1000;

        this.emit({
            type: 'ec',
            value: eC_reading
        });

        console.log('Conductivity: ' + eC_reading);
    },

    ph_data: function () {
        pH_reading = Math.random() * 14;

        this.emit({
            type: 'ph',
            value: pH_reading
        });

        console.log('ph: ' + pH_reading);
    },

    temp_data: function () {
        let currentTemp = Math.random();

        this.emit({
            type: 'temperature',
            value: currentTemp
        });

       	console.log('Temp: ' + currentTemp);
    },

    hum_data: function () {
        let currentHumidity = Math.random();
        this.emit({
            type: 'humidity',
            value: currentHumidity
        });

        console.log("Humidity: " + currentHumidity);
    }
}).connect();

// Default is localhost: 3000
// growHub.connect({
//     host: "grow.commongarden.org",
//     tlsOpts: {
//       tls: {
//         servername: "galaxy.meteor.com"
//       }
//     },
//     port: 443,
//     ssl: true
// });