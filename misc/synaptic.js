var synaptic = require('synaptic');

var Neuron = synaptic.Neuron,
    Layer = synaptic.Layer,
    Network = synaptic.Network,
    Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;


var myLSTM = new Architect.LSTM(2,4,4,4,1); 
// var trainer = new Trainer(myLSTM);

var trainingSet = [
  {
    input: [0,0,1,0.12,0,0,0,0,1,1]
    output: [1]
  },
  {
    input:  [0,1,0,0.045,0,0,1,1,0,0] 
    output: [0]
  },
  {
    input:  [1,0,0,0.42,1,1,0,0,0,0]
    output: [1]
  }
]

myLSTM.trainer.train(trainingSet,{
    rate: .1,
    iterations: 20000,
    error: .05,
    shuffle: true,
    log: 1000,
    cost: Trainer.cost.CROSS_ENTROPY
});

console.log(myLSTM.activate([0.1]));

