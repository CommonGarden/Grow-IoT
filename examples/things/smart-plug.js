const Thing = require('../../dist/Thing.js');
const Hs100Api = require('hs100-api');

// This is meant to be a generic smart-plug class.
module.exports = new Thing({
    component: 'smart-plug'

	properties: {
		name: "Tp-link smart plug(s) controller",
        state: null
	},

	initialize: function () {
        var client = new Hs100Api.Client();

        var plugs = [];

		// Look for plug, assign to plug property.
        client.startDiscovery().on('plug-new', (plug) => {
          // There is definitely a better way of doing this.
          console.log(plug);
          plugs.push(plug);
        });

        setTimeout(function(){
        	console.log(plugs);
        }, 3000)
	},

    turn_on: function () {
        console.log("On");
    },

    turn_off: function () {
        console.log("off");
    }
});
