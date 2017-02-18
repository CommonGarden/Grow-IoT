var Thing = require('../dist/Grow.umd.js');

// This example sucks.
var example = new Thing({
	properties: {
		name: "Bob"
	},

	method: function () {
		console.log('Current name is ' + example.get('name'));
	}
});

example.coap();

// defaults to localhost
example.coapClient();
