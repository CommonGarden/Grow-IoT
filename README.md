# Thing.js

A javascript library for working with things! Inspired by [W3C web of things framework](), a thing is an object that has:

* Properties
* Actions
* Events

[You can read the code and docs here.]()

## Install
```bash
npm install Thing.js
```

### Example
```
var Thing = require('Thing.js');

var Light = new Thing({
    name: 'Light',
    description: 'An LED light with a basic on/off api.',
    state: 'off',
    actions: [
        {
          'name': 'On',
          'description': 'Turns the light on.',
          'id': 'turn_light_on',
          'updateState': 'on',
          'schedule': 'at 9:00am',
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
        }
      ],
    events: [
        {
          'name': 'Light turned on',
          'on': 'turn_light_on',
          'function': function () {
            // Do something in response.
          }
        }
    ]
});

Light.callAction('turn_light_on');

```