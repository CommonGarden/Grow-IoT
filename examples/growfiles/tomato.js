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
      ideal: 55,
      max: 61,
    },
    temperature: {
      min: 17,
      max: 28,
    },
  },

  // Targets can be moving!
  cycles: {
    // You can optionally define a function called 'day' or 'night' or 'whatever_the_hell_you_want_to_name_the_property', which will run when scheduled. ; )
    day: {
      schedule: 'after 6:00am',
      targets: {
        temperature: {
          ideal: 22
        }
      }
    },
    night: {
      schedule: 'after 9:00pm',
      targets: {
        temperature: {
          ideal: 18
        }
      }
    }
  }
};
