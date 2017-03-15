const Thing = require('Grow.js');
const Hs100Api = require('hs100-api');

module.exports = new Thing({
  properties: {
    name: 'Water pump'
  },

  start: function () {
    var client = new Hs100Api.Client();

    client.startDiscovery().on('plug-new', (plug) => {
      // There is definitely a better way of doing this.
      if (plug.name === 'Water pump') {
        this.pump = plug;
      }
    });
  },

  turn_on: function () {
    if (this.pump) {
      this.pump.setPowerState(true);
    }
    console.log('Light on');
  },

  turn_off: function () {
    if (this.pump) {
      this.pump.setPowerState(false);
    }
    console.log('Light off');
  }
});


