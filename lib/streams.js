// // Documentation: https://nodejs.org/api/stream.html
// const Readable = require('stream').Readable;
// const Writable = require('stream').Writable;

// var SetupStreams = function() {
//   // Readable Stream: this is "readable" from the server perspective.
//   // The device publishes it's data to the readable stream.
//   this.readableStream = new Readable({objectMode: true});

//   // We are pushing data when sensor measures it so we do not do anything
//   // when we get a request for more data. We just ignore it for now.
//   this.readableStream._read = function () {};

//   this.readableStream.on('error', function (error) {
//     console.log("Error", error.message);
//   });

//   // Writable stream: this is writable from the server perspective. A device listens on
//   // the writable stream to recieve new commands.
//   this.writableStream = new Writable({objectMode: true});

//   return this;
// }

// export default SetupStreams;


// // Pipes readable and writeable streams. ??????
// // GROWJS.prototype.pipeInstance = function () {
// //   var self = this;

// //   this.pipe(self.writableStream);
// //   self.readableStream.pipe(this);
// // };


