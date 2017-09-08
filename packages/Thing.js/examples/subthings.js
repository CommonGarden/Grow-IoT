// This is to experiment with the concept of subthings.
const Thing = require('../dist/Thing.js');
// NEW! Import things.
const testThing = require('./things/test-thing.js');

const complexThing = new Thing({
	properties: {
		state: null
	},

	// Way to include a thing, create a property for the object!
	testThing: testThing,

	initialize: function () {
		console.log('complexThing initialized');
		
		this.on('method', ()=> {
			console.log('Got property of subthing');
		});
	},

	wrapup: function () {
		this.removeAllListeners();
		console.log('Listeners removed');
	},

	method: function () {
		// use a subthing method like this:
		console.log(this.testThing.get('name'));
	}
});

complexThing.call('method');
complexThing.call('wrapup');
complexThing.call('method');


