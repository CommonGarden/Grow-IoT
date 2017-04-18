const Thing = require('../../lib/Grow.js');
const RaspiCam = require('raspicam');
const fs = require('fs');

const Cam = new Thing({
  uuid: '335111e0-3952-4844-be1b-f2abc9aa8848',
  token: 'T2yXwHo2NC6WvCp93GkvKu6KHfc8AT78',

  component: 'ImageComponent',

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

    setInterval(function() {
      camera.start();
    }, 3600000)
  }
});


Cam.connect({
  host: 'grow.commongarden.org',
  port: 443,
  ssl: true
});

