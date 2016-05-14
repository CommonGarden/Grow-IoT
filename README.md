# Thing.js

A javascript library for working with things! Inspired by [W3C web of things framework](), a thing is an object that has:

* Properties
* Actions
* Events

This library is a constructor for a thing object. For example of how this can be used in an IoT stack, checkout [Grow.js](https://github.com/CommonGarden/Grow.js).

<!-- [You can read the code and docs here.]() -->

## Install
```bash
npm install Thing.js
```

### Example
```
var Thing = require('Thing.js');

var Light = new Thing({
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
        }
      ]
    });

Light.callAction('turn_light_on');

```

### Actions
Actions represent the basic API of the thing. Actions can be scheduled with a schedule property.

### Events
Events allow you to check conditions or emit events at certain times. For example:

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
          'name': 'harvest plant',
          'id': 'harvest_plant',
          'schedule': 'after 70 days' // Will emit this event after 70 days.
        }
      ]