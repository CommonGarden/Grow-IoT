const brain = require('brain.js');

// //create a simple recurrent neural network 
let net = new brain.NeuralNetwork();

const data = [
   {input: { p: 0.613 }, output: { ok: 1 }},
   {input: { p: 0.616 }, output: { ok: 1 }},
   {input: { p: 0.615 }, output: { ok: 1 }},
   {input: { p: 0.615 }, output: { ok: 1 }},
   {input: { p: 0.515 }, output: { base: 1 }},
   {input: { p: 0.715 }, output: { acid: 1 }},
]

net.train(data);

var output = net.run({ p: 0.715 });  // { white: 0.81, black: 0.18 }


console.log(output);

// var net = new brain.NeuralNetwork();

// net.train([{input: { r: 0.03, g: 0.7, b: 0.5 }, output: { black: 1 }},
//            {input: { r: 0.16, g: 0.09, b: 0.2 }, output: { white: 1 }},
//            {input: { r: 0.5, g: 0.5, b: 1.0 }, output: { white: 1 }}]);

// var output = net.run({ r: 1, g: 0.4, b: 0 });  // { white
	// console.log(output);