const Thing = require('../dist/Thing.es6.js');
// NEW! Import things.
const thing1 = require('./things/test-thing.js');

console.log(thing1.methodList());

const thing2 = new Thing({
	echo: function (string) {
		console.log(string);
	}
});


// Call a method
thing1.call('method');

// Event emitter api is also available.
thing1.on('property-updated', function(key) {
  thing2.call('echo', 'Property ' + key + ' updated.');
  thing1.call('method');
});

setTimeout(function () {
	// Set a property
	thing1.set('name', 'Alice');
}, 3000);