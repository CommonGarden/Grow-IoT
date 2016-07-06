var brain = require('brain');

var net = new brain.NeuralNetwork();

// var calibrate = function (listOfReadings, ideal, threshold) {
// 	// for 100 readings
// 	// 	trainingset.append readings
// 	// train the model.
// };

var calibrated = net.train([
   {input: { ph: 4.8 }, output: { low: 1 }},
   {input: { ph: 4.9 }, output: { low: 1 }},
   {input: { ph: 5.0 }, output: { low: 1 }},
   {input: { ph: 5.2 }, output: { low: 1 }},
   {input: { ph: 7.0 }, output: { high: 1 }},
   {input: { ph: 7.12 }, output: { high: 1 }},
   {input: { ph: 6.0 }, output: { good: 1 }},
   {input: { ph: 6.12 }, output: { good: 1 }},
   {input: { ph: 6.12 }, output: { good: 1 }}
], {
  errorThresh: 0.005,  // error threshold to reach
  iterations: 20000,   // maximum training iterations
  log: true,           // console.log() progress periodically
  logPeriod: 10,       // number of iterations between logging
  learningRate: 0.3    // learning rate
});

var output = calibrated.run({ ph: 5.3 });

console.log(output);
// { low: 0.8938473981996788,
//   high: 0.000014449119308673631,
//   good: 0.26469662098930724 }
