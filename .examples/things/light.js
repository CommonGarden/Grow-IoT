const Thing = require('Thing.js');
const Hs100Api = require('hs100-api');

module.exports = new Thing({
  properties: {
    name: 'Lamp',
    state: 'off',
    interval: 10000,
  },

  initialize: function () {
    var client = new Hs100Api.Client();
    var interval = this.get('interval');

    client.startDiscovery().on('plug-new', (plug) => {
      if (plug.name === this.get('name')) {
        this.light = plug;
      }
    });

    this.interval = setInterval(()=> {
      this.power_data();
    }, interval);
  },

  power_data: function () {
    if (this.light) {
      this.light.getInfo().then((data)=> {
        let powerData = data.consumption.get_realtime;
        console.log(powerData);
        this.emit('power', powerData);
      });
    }
  },

  turn_on: function () {
    if (this.light) {
      this.light.setPowerState(true);
    }
    this.set('state', 'on');
    console.log('Light on');
  },

  turn_off: function () {
    if (this.light) {
      this.light.setPowerState(false);
    }
    this.set('state', 'off');
    console.log('Light off');
  }
});


