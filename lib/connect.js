// /*
// SSL is supported though will require a bit more setup. If you are hosting your instance off a computer with a dedicated IP address include the following info in your configuration object.

// ```json
//     "host": "YOUR_IP_HERE",
//     "port": 443,
//     "ssl": true,
// ```

// If you are hosting on a cloud instance such as [Meteor Galaxy](https://galaxy.meteor.com), you might need specify the servername. The example below shows you how to connect securely to the instance at [grow.commongarden.org](https://grow.commongarden.org):

// ```json
//     "host": "grow.commongarden.org",
//     "tlsOpts": {
//         "tls": {
//             "servername": "galaxy.meteor.com"
//         }
//     },
//     "port": 443,
//     "ssl": true,
//     "thing": { ... }
// ```
// */

// const _ = require('underscore');
// const DDPClient = require('ddp');
// const EJSON = require("ddp-ejson");


// var DDP = {
//   connect (config, callback) {
//     this.ddpclient = new DDPClient(_.defaults(config, {
//       host: 'localhost',
//       port: 3000,
//       ssl: false,
//       maintainCollections: false
//     }));

//     this.ddpclient.connect(function (error, wasReconnect) {
//       if (error) return callback(error);

//       if (wasReconnect) {
//         console.log("Reestablishment of a Grow server connection.");
//       }
//       else {
//         console.log("Grow server connection established.");
//       }

//       if (this.uuid || this.token) {
//         return this._afterConnect(callback, {
//           uuid: this.uuid,
//           token: this.token
//         });
//       }

//       // console.log(JSON.stringify(this.config));
//       // Break this out
//       this.ddpclient.call(
//         'Device.register',
//         [config],
//         function (error, result) {
//           if (error) return callback(error);

//           assert(result.uuid, result);
//           assert(result.token, result);

//           this.uuid = result.uuid;
//           this.token = result.token;

//           this._afterConnect(callback, result);
//         }
//       );
//     });
//   },
  
//   /*
//    * Runs imediately after a successful connection. Makes sure a UUID and token are set.
//    */
//   _afterConnect(callback, result) {

//     this.ddpclient.subscribe(
//       'Device.messages',
//       [{uuid: this.uuid, token: this.token}],
//       function (error) {
//         if (error) return callback(error);

//         if (!this._messageHandlerInstalled) {
//           this._messageHandlerInstalled = true;

//           this.ddpclient.on('message', function (data) {
//             data = EJSON.parse(data);

//             if (data.msg !== 'added' || data.collection !== 'Device.messages') {
//               return;
//             }

//             this.push(data.fields.body);
//           });
//         }
//       }
//     );

//     // Now check to see if we have a stored UUID.
//     // If no UUID is specified, store a new UUID.
//     if (_.isUndefined(this.config.uuid) || _.isUndefined(this.config.token)) {
//       this.config.uuid = result.uuid;
//       this.config.token = result.token;

//       this.writeChangesToGrowFile();
//     }

//     // SETUP STREAMS
//     // Readable Stream: this is "readable" from the server perspective.
//     // The device publishes it's data to the readable stream.
//     this.readableStream = new Readable({objectMode: true});

//     // We are pushing data when sensor measures it so we do not do anything
//     // when we get a request for more data. We just ignore it for now.
//     this.readableStream._read = function () {};

//     this.readableStream.on('error', function (error) {
//       console.log("Error", error.message);
//     });

//     // Writable stream: this is writable from the server perspective. A device listens on
//     // the writable stream to recieve new commands.
//     this.writableStream = new Writable({objectMode: true});
 
//     callback(null, result);
//   }
// };

// export default DDP;
