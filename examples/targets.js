const Grow = require('../lib/Grow.js');
const example = new Grow({});

let targets = {
  temperature: {
    min: 17,
    ideal: 22,
    max: 28,
  },
}

example.on('alert', (message)=> {
  console.log(message);
});

example.on('correction', (key, correction)=> {
  console.log(key + 'correction: ' + correction);
});

example.registerTargets(targets);

example.emit('temperature', {value: 10});
// { temperature: 'low' }

example.emit('temperature', {value: 30});
// { temperature: 'high' }

