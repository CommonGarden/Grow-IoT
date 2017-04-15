const Thing = require('../../lib/Grow.js');
const RaspiCam = require('raspicam');
const fs = require('fs');

const Cam = new Thing({
  uuid: 'bdc72ff7-f879-418b-8bc9-989d333ef022',
  token: '9SPHfRZWoNG6EWFEWXoPXRmbaLKns2JX',

  component: 'image-component',

  properties: {
    name: 'Camera',
  },

  start: function () {
    var camera = new RaspiCam({
      mode: 'photo',
      output: './image.jpg',
      encoding: 'jpg',
      timeout: 0 // take the picture immediately
    });

    camera.on('start', function( err, timestamp ){
      console.log('photo started at ' + timestamp );
    });

    camera.on('read', ( err, timestamp, filename ) => {
      fs.readFile('./image.jpg', (err, data) => {
        if (err) throw err; // Fail if the file can't be read.
        this.sendImage(data);
        camera.stop();
      });
    });

    camera.on('exit', function( timestamp ){
      console.log('photo child process has exited at ' + timestamp );
    });

    camera.start();
  }
});


Cam.connect({
  host: '192.168.1.111'
});

