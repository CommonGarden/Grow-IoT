// See node-webcam docs for additional instructions.
// https://www.npmjs.com/package/node-webcam
const NodeWebcam = require( 'node-webcam' );
const Thing = require('../../lib/Grow.js');
const fs = require('fs');
 
const opts = {
  width: 1280,
  height: 720,
  delay: 0,
  quality: 100,
  output: 'jpeg',
  verbose: true
}

module.exports = new Thing({
  properties: {
    name: 'Camera',
    interval: 100000
  },

  picture: function () {
    NodeWebcam.capture( 'image', opts, ( err, data )=> {
      if ( !err ) console.log( 'Image created!' );
      fs.readFile('./' + data, (err, data) => {
        if (err) throw err; // Fail if the file can't be read.
        this.sendImage(data);
      });
    });
  },

  // start: function () {
  //   let interval = this.get('interval');
  //   this.interval = setInterval(()=> {
  //     this.picture();
  //   }, interval);
  // },

  stop: function () {
    clearInterval(this.interval);
  }
});
