const Thing = require('../../lib/Thing.js');
const light = require('../things/light');
const coap = require('coap');

// This example sucks, make i
const Light = new Thing({
  uuid: '9033b9c1-889c-43eb-bb3e-339348770c0e',
  token: 'FQhx9bb4qczkNWERNEABQNP6yMTotoLM',

  component: 'smart-light',

  properties: {
    state: light.properties.state,
  },

  start: function () {
    console.log('Thing initialized, this code runs first');
  },

  turn_on: function () {
    light.call('turn_on');
  },

  turn_off: function () {
    light.call('turn_off');
  }
});

Light.connect();
Light.call('turn_on');
