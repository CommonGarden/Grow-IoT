var assert = require("assert");
var brain = require('brain');

var net = new brain.NeuralNetwork();

// Need to figure out how to generate this data.
var ph_data = [
   {input: { ph: 4.8 }, output: { low: 1 }},
   {input: { ph: 4.9 }, output: { low: 1 }},
   {input: { ph: 5.0 }, output: { low: 1 }},
   {input: { ph: 5.2 }, output: { low: 1 }},
   {input: { ph: 7.0 }, output: { high: 1 }},
   {input: { ph: 7.12 }, output: { high: 1 }},
   {input: { ph: 6.0 }, output: { good: 1 }},
   {input: { ph: 6.12 }, output: { good: 1 }},
   {input: { ph: 6.12 }, output: { good: 1 }}
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
    console.log("trained in " + obj.iterations + " iterations with error: "
                + obj.error);
  },

  errorThresh: 0.005,  // error threshold to reach
  iterations: 20000,   // maximum training iterations
  log: true,           // console.log() progress periodically
  logPeriod: 10,       // number of iterations between logging
  learningRate: 0.3    // learning rate
});

// kick it off
flood(trainStream, ph_data);

function flood(stream, data) {
  for (var i = 0; i < data.length; i++) {
    stream.write(data[i]);
  }
  // let it know we've reached the end of the data
  stream.write(false);
}

console.log(net.run({ ph: 6.5 }));
