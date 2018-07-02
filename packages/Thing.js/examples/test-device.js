// Todo: make this into a more useful mock driver for different components.
var Thing = require('../lib/Thing.js');
var inquirer = require('inquirer');
var _ = require('underscore');

var args = process.argv.slice(2);
var uuid = args[0];
var token = args[1];
var component = args[2];

var questions = [
    {
        type: 'input',
        name: 'uuid',
        message: 'Enter device UUID (you are given this when you create a new thing)',
    },
    {
        type: 'input',
        name: 'token',
        message: 'Enter token',
    },
    {
        type: 'input',
        name: 'component',
        message: 'Web component to render'
    }
];

if(_.isUndefined(uuid) || _.isUndefined(token) || _.isUndefined(component)) {
    inquirer.prompt(questions).then(function (answers) {
        uuid = answers.uuid;
        token = answers.token;
        component = answers.component;
        testDevice(uuid, token, component);
    });
} else {
    testDevice(uuid, token, component);
}

function testDevice (u, t, c) {
    var testDevice = new Thing({
    // PUT YOUR UUID AND TOKEN HERE OR SUPPLY THEM AS ARGUMENTS
        uuid: u,
        token: t,
        component: c,

        properties: {
            state: 'off',
            interval: 3000
        },

        start: function () {
            // Emit fake data for testing
            setInterval(()=> {
                this.emit('temperature', Math.random());
                this.emit('humidity', Math.random());
                this.emit('pressure', Math.random());
                this.emit('ph', Math.random());
                this.emit('water_temperature', Math.random());
                this.emit('ec', Math.random());
                this.emit('co2', Math.random());
                this.emit('moisture_1', Math.random());
                this.emit('moisture_2', Math.random());
                this.emit('lux', Math.random());
            }, this.get('interval'));
        },

        turn_on: function () {
            console.log('on');
            testDevice.set('state', 'on');
        },

        turn_off: function () {
            console.log('off');
            testDevice.set('state', 'off');
        },
    }, 'data.json');

    testDevice.connect();

    setTimeout(()=> {
        testDevice.feed.get(0, console.log);
    }, 3000);
}
