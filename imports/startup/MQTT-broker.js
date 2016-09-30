// // TODO: include mosca from NPM.
import {mosca} from 'mosca';
 
const mongopubsub = {
  //using ascoltatore 
  type: 'mongo',
  url: 'mongodb://localhost:3001/meteor',
  pubsubCollection: 'mqtt',
  mongo: {}
};

const settings = {
  port: 1883,
  backend: mongopubsub
};
 
const server = new mosca.Server(settings);
 
server.on('clientConnected', (client) => {
  console.log('client connected', client.id);
});
 
// fired when a message is received 
server.on('published', (packet, client) => {
  console.log('Published', packet.payload);
  console.log(client);
});
 
server.on('ready', setup);
 
// fired when the mqtt server is ready
// Todo: map mqtt stuff to the ddp api.
function setup() {
  console.log('Mosca server is up and running');
}
