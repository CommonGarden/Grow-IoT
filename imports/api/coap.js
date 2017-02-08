import coap from 'coap';
import url from 'url';
import { Meteor } from 'meteor/meteor';

const server = coap.createServer();


server.on('request', function(req, res) {
  let urlParts = url.parse(req.url, true);

  // console.log(urlParts);

  let method = urlParts.pathname.replace(/\//g, '');
  
  // TODO...
  let auth = {};
  let event = {
    message: 'test event'
  };
  let config = {
    component: 'test-device'
  };

  switch (method) {
    case 'register':
      console.log('register');

      Meteor.call('Thing.register', auth, config, function(error, documentId) {
        if (error) {
          return console.error("New Thing.event Error", error);
        }

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ok: true}));
      });
      break;
    case 'emit':
      Meteor.call('Thing.emit', auth, event, function(error, documentId) {
        if (error) {
          return console.error("New Thing.event Error", error);
        }

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ok: true}));
      });
      break;
    case 'setProperty':
      let key = urlParts.query.key;
      let value = urlParts.query.value;

      Meteor.call('Thing.setProperty', auth, key, value, function(error, documentId) {
        if (error) {
          return console.error("New Thing.event Error", error);
        }

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ok: true}));
      });
      break;

    case 'call':
      Meteor.call('Thing.sendCommand', thingUuid, type, options, function(error, documentId) {
        console.log(documentId);

        if (error) {
          return console.error("New Thing.event Error", error);
        }

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ok: true}));
      });
    default:
      res.end('Hello ' + req.url.split('/')[1] + '\n');
      break;
  }
});

server.listen(function() {
  console.log('server started')
})

  
// var req   = coap.request('coap://localhost/method');

// req.on('response', function(res) {
//   res.pipe(process.stdout)
// });
// req.end();