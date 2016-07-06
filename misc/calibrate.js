// An experiment in using nueral networks for calibration.
var assert = require("assert");
var brain = require('brain');

var net = new brain.NeuralNetwork();

var ph_data = [
   {input: { known: 4.0, reading: 4.10 }, output: { actual: 4.0, offset: -0.10 }},
   {input: { known: 4.0, reading: 4.11}, output: { actual: 4.0, offset: -0.11 }},
   {input: { known: 4.0, reading: 4.12}, output: { actual: 4.0, offset: -0.12 }},
   {input: { known: 4.0, reading: 4.11}, output: { actual: 4.0, offset: -0.11 }}
   // {input: { ph: 7.0 }, output: { high: 1 }},
   // {input: { ph: 7.12 }, output: { high: 1 }},
   // {input: { ph: 6.0 }, output: { good: 1 }},
   // {input: { ph: 6.12 }, output: { good: 1 }},
   // {input: { ph: 6.12 }, output: { good: 1 }}
];

var trainStream = net.createTrainStream({
  /**
   * Write training data to the stream. Called on each training iteration.
   */
  floodCallback: function() {
    flood(trainStream, ph_data);
  },

  /**
   * Called when the network is done training.
   */
  doneTrainingCallback: function(obj) {
    console.log("trained in " + obj.iterations + " iterations with error: " + obj.error);
  } //,

  // errorThresh: 0.005,  // error threshold to reach
  // iterations: 1000000,   // maximum training iterations
  // log: true,           // console.log() progress periodically
  // logPeriod: 10,       // number of iterations between logging
  // learningRate: 0.1    // learning rate
});

// console.log(trainStream);

// kick it off
flood(trainStream, ph_data);

function flood(stream, data) {
  for (var i = 0; i < data.length; i++) {
    stream.write(data[i]);
  }
  // let it know we've reached the end of the data
  stream.write(false);
}

// flood(trainStream, [
//    {input: { known: 4.0, reading: 4.09 }, output: { offset: 1.09 }},
//    {input: { known: 4.0, reading: 4.3 }, output: { offset: 1.10 }},
//    {input: { known: 4.0, reading: 4.12 }, output: { offset: 1.12 }},
//    {input: { known: 4.0, reading: 4.11 }, output: { offset: 1.11 }}
// ]);



// What is this?
console.log(net.run({ reading: 4.08 }).actual);
console.log(4.0 + net.run({ reading: 4.12 }).offset);
// console.log(net.run({ reading: 4.09 }).offset * 4.0);
// console.log(net.run({ reading: 4.3 }).offset * 4.0);
// console.log(net.run({ reading: 4.11 }).offset * 4.0);

