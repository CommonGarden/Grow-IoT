const Thing = require('Grow.js');

// A rough GrowFile example... first draft, it's crude.
module.exports = new Thing({
  properties: {
    name: 'Grow File example',
    version: '0.1.5',
    cycles: {
      day: {
        start: 'after 6:00am',
        targets: {
          temperature: 24,
          co2: {
            min: 900,
            max: 1600
          }
        }
      },
      night: {
        start: 'after 9:00pm',
        targets: {
          temperature: 20,
          co2: {
            min: 400
          }
        }
      }
    }
  }
});
