var Thing = require('../dist/Grow.umd.js');

var thing1 = new Thing({
	properties: {
		name: "Bob"
	},

    method: function (name) {
        let newname = name || thing1.get('name');
        console.log('Current name is ' + newname);
    }
});

var thing2 = new Thing({
	echo: function (string) {
		console.log(string);
	}
});


// Call a method
thing1.call('method');

// Event emitter api is also available.
thing1.on('property-updated', function(key) {
  // console.log(key);
  // console.log('New name is ' + thing1.get('name'));
  thing2.call('echo', 'Property ' + key + ' updated.');
  thing1.call('method');
});

setTimeout(function () {
	// Set a property
	thing1.set('name', 'Alice');
}, 3000);