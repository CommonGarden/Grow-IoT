import mosca from 'mosca';
import { Mongo } from 'meteor/mongo';

export const MQTT = new Mongo.Collection('mqtt');
 
const mongopubsub = {
  type: 'mongo',
  url: 'mongodb://localhost:3001/meteor',
  pubsubCollection: 'mqtt',
  mongo: {}
};

const settings = {
  port: 1883,
  backend: mongopubsub,
  persistence: {
    factory: mosca.persistence.Mongo,
    url: 'mongodb://localhost:3001/meteor' 
  }
};
 
const server = new mosca.Server(settings);

server.on('ready', () => {
  console.log('Mosca server is up and running');

  // fired when a client connects
  server.on('clientConnected', function(client) {
    console.log('Client connected: ', client.id);
  });

  // fired when a client disconnects
  server.on('clientDisconnected', function(client) {
    console.log('Client disconnected: ', client.id);
  });
   
  // fired when a message is received 
  server.on('published', (packet, client) => {
    let message = packet.payload.toString();
    
    switch (packet.topic) {
      case 'register':
        let deviceInfo = JSON.parse(message);
        console.log('Register: ' + message);

        // TODO: get something like this working?
        // Meteor.call('Device.register',
        //   deviceInfo,
        //   (error, documentId) => {
        //     if (error) {
        //       console.error("New deviceerror", error);
        //       return alert(`New deviceerror: ${error.reason || error}`);
        //     } else {}
        //   }
        // );
        break;
      case "hello":
        // Publish message to topic
        let response = {
          topic: '/hello',
          payload: 'this is a test',
          qos: 0, // 0, 1, or 2
          retain: false // or true
        };
        server.publish(response, function() {
          console.log('done');
        });
        break;
      case "setProperty":
        console.log('Published: ', message);
        break;
      default:
        return;
    }
  });
});
