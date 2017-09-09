const Thing = require('Thing.js');
// NEW! Import things.
const thing1 = require('./things/test-thing.js');
const adder = require('./things/adder.js');

const thing2 = new Thing({
	// Here we include an adder thing in thing2.
	adder: adder,
	echo: function (string) {
		console.log(string);
	}
});


// Call a method
thing1.call('method');

// Event emitter api is also available.
thing1.on('property-updated', function(key) {
  let addition = thing2.adder.call('add', [10, 2, 3]);
  thing2.call('echo', 'Property ' + key + ' updated. Addition result: ' +  addition);
  thing1.call('method');
});

setTimeout(function () {
	// Set a property
	thing1.set('name', 'Alice');
}, 3000);