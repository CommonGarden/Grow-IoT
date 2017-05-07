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
 
 
const Cam = new Thing({
  uuid: 'bdc72ff7-f879-418b-8bc9-989d333ef022',
  token: '9SPHfRZWoNG6EWFEWXoPXRmbaLKns2JX',

  component: 'image-component',

  properties: {
    name: 'Camera',
  },

  start: function () {
    setInterval(()=> {
      NodeWebcam.capture( 'image', opts, ( err, data )=> {
        if ( !err ) console.log( 'Image created!' );
        fs.readFile('./' + data, (err, data) => {
          if (err) throw err; // Fail if the file can't be read.
          this.sendImage(data);
        });
      });
    }, 10000);
  }
});

Cam.connect({
  host: '192.168.1.111'
});