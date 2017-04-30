// const Grow = require('Grow.js');

// A rough GrowFile example... first draft, it's crude.
// Feel free to make suggestions though.
module.exports = {
  name: 'Tomato',
  version: '0.1.0',
  description: 'A simple grow file with targets and day / night cycles.',
  targets: {
    ph: {
      min: 6.0,
      ideal: 6.15,
      max: 6.3,
    },
    ec: {
      min: 1400,
      ideal: 1500,
      max: 1700,
    },
    humidity: {
      min: 51,
      max: 61
    },
    temperature: {
      unit: 'Celsius',
      min: 17,
      max: 28,
    }
  },

  cycles: {
    day: {
      schedule: 'after 6:00am',
      temperature: {
        ideal: 22
      }
    },
    night: {
      schedule: 'after 9:00pm',
      temperature: {
        ideal: 18
      }
    }
  }
};
