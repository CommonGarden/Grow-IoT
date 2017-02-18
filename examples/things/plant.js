// TODO: a plant example... which is really just a simple model of a plant.
const Thing = require('../../dist/Thing.es6.js');

module.exports = new Thing({
	properties: {
		name: "Plant"
	},

	initialize: function () {
		console.log('Thing 1 started.');
	},

    method: function (name) {
        let newname = name || this.get('name');
        console.log('Current name is ' + newname);
    }
});
