//   /////////// Setup Streams /////////////////////
//   // Documentation: https://nodejs.org/api/stream.html
  
//   // Readable Stream: this is "readable" from the server perspective.
//   // The device publishes it's data to the readable stream.
//   self.readableStream = new Readable({objectMode: true});

//   // We are pushing data when sensor measures it so we do not do anything
//   // when we get a request for more data. We just ignore it for now.
//   self.readableStream._read = function () {};

//   self.readableStream.on('error', function (error) {
//     console.log("Error", error.message);
//   });

//   // Writable stream: this is writable from the server perspective. A device listens on
//   // the writable stream to recieve new commands.
//   self.writableStream = new Writable({objectMode: true});


// // Pipes readable and writeable streams.
// GROWJS.prototype.pipeInstance = function () {
//   var self = this;

//   this.pipe(self.writableStream);
//   self.readableStream.pipe(this);
// };

// // On _write, call this.sendData()
// GROWJS.prototype._write = function (chunk, encoding, callback) {
//   var self = this;

//   self.sendData(chunk, callback);
// };

// // We are pushing data to a stream as commands are arriving and are leaving
// // to the stream to buffer them. So we simply ignore requests for more data.
// GROWJS.prototype._read = function (size) {
//   var self = this;
// };
