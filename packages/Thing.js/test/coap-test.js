const Thing = require('../lib/Thing.js');
const coap = require('coap');

global.expect = require('chai').expect;

(function setup () {
  beforeEach(function() {

    global.thing = {
      // Meta data
      uuid: null,
      token: null,

      // Properties can be updated by the API, Metadata cannot.
      properties: {
        state: 'on',
        testInitialize: false,
        testStart: false,
      },

      initialize: function () {
        return this.set('testInitialize', true);
      },

      start: function () {
        return this.set('testStart', true);
      },

      testMethod: function () {
        return 'test';
      },
          
      testOptions: function (option) {
        return option;
      },
    }
  });

  afterEach(function() {
    delete global.thing;
  });
})();


describe('Thing test', () => {
  // Do we really need a new thing every time?
  beforeEach(() => {
    global.testThing = new Thing(thing);
  });

  describe('CoAP', () => {
  	console.log('TODO')
  });

  afterEach(() => {
    delete global.testThing;
  });
});
