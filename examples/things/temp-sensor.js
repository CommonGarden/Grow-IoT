// TODO: a plant example... which is really just a simple model of a plant.
const Thing = require('../../dist/Thing.es6.js');

module.exports = new Thing({
	properties: {
		name: "Temp sensor",
        temperature: 70
	},

	initialize: function () {
		console.log('Temp sensor initialized');
	},

    tempUp: function () {
        let newTemp = this.get('temperature') + 1;
        this.set('temperature', newTemp);
    },

    tempDown: function () {
        let newTemp = this.get('temperature') - 1;
        this.set('temperature', newTemp);
    },

    read: function () {
        return this.get('temperature');
    }
});