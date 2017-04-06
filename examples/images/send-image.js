const Thing = require('../../lib/Grow.js');
const RaspiCam = require('raspicam');
const fs = require('fs');

const Cam = new Thing({
  uuid: '2234f0ca-c8b3-43a9-abae-eaa70324eb5a',
  token: 'FyLwxWWrx4cJQpfY23PAnFwFgTDyKctT',

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

