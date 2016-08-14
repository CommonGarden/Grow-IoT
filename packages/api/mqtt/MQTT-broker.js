// // TODO: include mosca from NPM.
// // import {mosca} from 'mosca';
 
// var mongopubsub = {
//   //using ascoltatore 
//   type: 'mongo',
//   url: 'mongodb://localhost:3001/meteor',
//   pubsubCollection: 'mqtt',
//   mongo: {}
// };

// var settings = {
//   port: 1883,
//   backend: mongopubsub
// };
 
// var server = new mosca.Server(settings);
 
// server.on('clientConnected', function(client) {
//     console.log('client connected', client.id);
// });
 
// // fired when a message is received 
// server.on('published', function(packet, client) {
//   console.log('Published', packet.payload);
// });
 
// server.on('ready', setup);
 
// // fired when the mqtt server is ready 
// function setup() {
//   console.log('Mosca server is up and running');
// }
