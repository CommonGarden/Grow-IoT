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

// Call a method
// example.call('method');

// // Event emitter api is also available.
// example.on('property-updated', function() {
//   console.log('New name is ' + example.get('name'));
// });

// setTimeout(function () {
// 	// Set a property
// 	example.set('name', 'Alice');
// }, 3000);

// example.listen(8080);

// example.coap();

// defaults to localhost
example.coap();
