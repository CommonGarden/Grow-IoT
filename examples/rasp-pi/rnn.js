var brain = require('brain.js');
const Controller = require('node-pid-controller');

// //create a simple recurrent neural network 
// var net = new brain.recurrent.RNN();

// net.train([{input: { pH: 0.613 }, output: { ok: 1 }},
//            {input: { pH: 0.616 }, output: { ok: 1 }},
//            {input: { pH: 0.615 }, output: { ok: 1 }},
//            {input: { pH: 0.615 }, output: { ok: 1 }},
//            {input: { pH: 0.515 }, output: { base: 1 }},
//            {input: { pH: 0.715 }, output: { acid: 1 }}]);

// var output = net.run({ pH: 0.815 });  // { white: 0.81, black: 0.18 }


// console.log(output);

const Controller = require('node-pid-controller');

ctr = new Controller({
	k_p: 0.25,
	k_i: 0.01,
	k_d: 0.01,
	dt: 1
});

ctr.setTarget(120);
