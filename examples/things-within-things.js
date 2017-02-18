// This is to experiment with the concept of subthings.
const Thing = require('../dist/Thing.es6.js');
// NEW! Import things.
const testThing = require('./things/test-thing.js');

const complexThing = new Thing({
	properties: {
		state: null
	},

	// Way to include a thing, create a property for the object!
	testThing: testThing,

	method: function () {
		// use a subthing method like this:
		console.log(this.testThing.get('name'));
	}
});

console.log(complexThing);
complexThing.call('method');
