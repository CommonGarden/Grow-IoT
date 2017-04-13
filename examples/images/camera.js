const Thing = require('../../lib/Grow.js');
const RaspiCam = require('raspicam');
const fs = require('fs');

const Cam = new Thing({
  uuid: '2234f0ca-c8b3-43a9-abae-eaa70324eb5a',
  token: 'FyLwxWWrx4cJQpfY23PAnFwFgTDyKctT',

  component: 'CameraComponent',

  properties: {
    name: 'Camera',
  },

  camera: new RaspiCam({
    mode: 'photo',
    output: './image.jpg',
    encoding: 'jpg',
    timeout: 0 // take the picture immediately
  }),

  start: function () {
    this.camera.on('start', function( err, timestamp ){
      console.log('photo started at ' + timestamp );
    });

    this.camera.on('read', ( err, timestamp, filename ) => {
      fs.readFile('./image.jpg', (err, data) => {
        if (err) throw err; // Fail if the file can't be read.
        this.sendImage(data);
      });
    });

    this.camera.on('exit', function( timestamp ){
      console.log('photo child process has exited at ' + timestamp );
    });
  },

  picture: function () {
    this.camera.start();
    this.camera.stop();
  }
});

// Connect over a local network.
Cam.connect({
  host: '192.168.1.111'
});

