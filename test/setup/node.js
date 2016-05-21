global.expect = require('chai').expect;

// require('babel/register');

(function setup () {
  beforeEach(function() {

    // Setup test things
    global.thing1 = {
      'name': 'Light',
      'description': 'An LED light with a basic on/off api.',
      'state': 'off',
      'actions': [
        {
          'name': 'On',
          'description': 'Turns the light on.',
          'id': 'turn_light_on',
          'updateState': 'on',
          'schedule': 'at 9:00am',
          'event': 'Light turned on',
          'function': function () {
            return 'Light on.';
          }
        },
        {
          'name': 'off',
          'id': 'turn_light_off',
          'updateState': 'off',
          'schedule': 'at 8:30pm',
          'event': 'Light turned off',
          'function': function () {
            return 'Light off.';
          }
        },
        {
          'name': 'Light data',
          'id': 'light_data',
          'type': 'light',
          'schedule': 'every 1 second',
          'function': function () {
            // Normally, this would be publishing data on the readable stream.
            return 'data';
          }
        }
      ],
      'events': [
        {
          'name': 'light data is data',
          'id': 'check_light_data',
          'on': 'light_data', // Hook into an action.
          'function': () => {
            return 'this';
          }
        },
        {
          name: 'Change light bulb event',
          id: 'change_light_bulb',
          schedule: 'after 10 seconds' // Emits this event in 30s 
        }
      ]
    };

    global.thing2 = {
        name: "Light", // The display name for the thing.
        id: "Light",
        desription: "An LED light with a basic on/off api.",
        username: "jakehart", // The username of the account you want this device to be added to.
        properties: {
            state: "off",
            lightconditions: null
        },
        actions: [ // A list of action objects
            {
                name: "On", // Display name for the action
                description: "Turns the light on.", // Optional description
                id: "turn_light_on", // A unique id
                schedule: "at 9:00am", // Optional scheduling using later.js
                event: "Light turned on", // Optional event to emit when called.
                function: function () {
                    // The implementation of the action.
                    LED.high();
                    grow.updateProperty('state', 'on');
                }
            },
            {
                name: "off",
                id: "turn_light_off",
                schedule: "at 8:30pm",
                event: "Light turned off",
                function: function () {
                    LED.low();
                    grow.updateProperty('state', 'off');
                }
            },
            {
                name: "Log light data", // Events get a display name like actions
                id: "light_data", // Events also get an id that is unique to the device
                type: "light", // Currently need for visualization component... HACK.
                template: "sensor",
                schedule: "every 1 second", // Events should have a schedule option that determines how often to check for conditions.
                function: function () {
                    // function should return the event to emit when it should be emited.
                    grow.sendData({
                      type: "light",
                      value: lightSensor.value
                    });
                }
            }
        ],
        events: [
            {
                name: "It's dark.",
                id: 'dark',
                on: 'light_data', // Hook into an action.
                function: function () {
                    if (lightSensor.value < 100 && grow.getProperty('lightconditions') != 'dark') {
                        grow.emitEvent('dark');
                        grow.setProperty('lightconditions', 'dark');
                    }
                }
            }
        ]
    };

  });

  afterEach(function() {
    delete global.thing1;
    delete global.thing2;
  });
})();
