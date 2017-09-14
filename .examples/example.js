const Growjs = require('Grow.js');

const Grow = new Growjs();

let climateRecipe = {
  'name':'Basic grow file',
  'description': 'Metadata goes here.',
  'version':'0.1.0',
  'phases':{
    'vegetative':{
      'length': '28 days',
      'targets':{
        'ph':{
          'min':6,
          'ideal':6.15,
          'max':6.3
        },
        'ec':{
          'min':1400,
          'ideal':1500,
          'max':1700
        },
        'humidity':{
          'min':51,
          'max':61
        },
        'temperature':{
          'min':17,
          'max':28
        }
      },
      'cycles':{
        'day':{
          'schedule':'after 6:00am',
          'targets':{
            'temperature':{
              'ideal':22
            }
          }
        },
        'night':{
          'schedule':'after 9:00pm',
          'targets':{
            'temperature':{
              'ideal':18
            }
          }
        }
      }
    },
    'bloom':{
      'length': '32 days',
      'targets':{
        'ph':{
          'min':6,
          'ideal':6.15,
          'max':6.3
        },
        'ec':{
          'min':1400,
          'ideal':1500,
          'max':1700
        },
        'humidity':{
          'min':51,
          'max':59
        },
        'temperature':{
          'min':17,
          'max':28
        }
      },
      'cycles':{
        'day':{
          'schedule':'after 7:00am',
          'targets':{
            'temperature':{
              'ideal':22
            }
          }
        },
        'night':{
          'schedule':'after 7:00pm',
          'targets':{
            'temperature':{
              'ideal':22
            }
          }
        }
      }
    }
  }
}

Grow.startGrow(climateRecipe);

// Event emitter style api
Grow.on('alert', (message)=> {
  console.log(message);
});

Grow.emit('temperature', 0); // { temperature: 'low' }
Grow.emit('temperature', 100); // { temperature: 'high' }

// If an ideal is defined a built-in PID controller emits a correction event
Grow.on('correction', (key, correction)=> {
  console.log(key + ' correction: ' + correction);
});

// The pH target in the vegetative phase has an `ideal` target
// He a pH of 6 isn't low, but it isn't ideal
Grow.emit('ph', 6); 
// ph correction: 0.04050000000000009

