const Thing = require('../../dist/Thing.es6.js');

module.exports = new Thing({
	properties: {
		name: "Bob"
	},

	initialize: function () {
		console.log('Thing 1 started.');
	},

    method: function (name) {
        let newname = name || this.get('name');
        console.log('Current name is ' + newname);
    }
});
