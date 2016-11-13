let Controller = require('node-pid-controller');

let ctr = new Controller({
  k_p: 0.9,
  k_i: 0.01,
  k_d: 0.01,
  dt: 1
});

ctr.setTarget(6.5);
ctr.update(6.4);
ctr.update(6.4);
ctr.update(6.4);
ctr.update(6.4);
ctr.update(6.3);
ctr.update(6.4);
ctr.update(6.4);
ctr.update(6.4);
// ctr.setTarget(6.5);
let correction = ctr.update(6.3);

// let goalReached = false
// while (!goalReached) {
//   let output = measureFromSomeSensor();
//   let input  = ctr.update(output);
//   applyInputToActuator(input);
//   goalReached = (input === 0) ? true : false; // in the case of continuous control, you let this letiable 'false'
// }

console.log(correction);
