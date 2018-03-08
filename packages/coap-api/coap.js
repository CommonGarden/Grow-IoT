const coap = require('coap');
const url = require('url');
const _ = require('underscore');

const server = coap.createServer();

server.on('request', function(req, res) {
  // console.log(req)
    let urlParts = url.parse(req.url, true);
    let method = urlParts.pathname.replace(/\//g, '');
    let payload = JSON.parse(req.payload.toString());

    console.log(urlParts);
    console.log(method);
    console.log(payload);

    let auth = {
      uuid: payload.uuid,
      token: payload.token
    }

    // TODO change this.
    let thing = Things.findOne(auth, {
      fields: {
        _id: 1,
        properties: 1
      }
    });
    if (!thing) { throw new Meteor.Error('unauthorized', "Unauthorized."); }

    // Todo: more extensive checks.

    switch (method) {
      case 'register':
        let config = _.extend(payload, { registeredAt: new Date() });

        // Update the document
        if (!Things.update(thing._id, {
          $set: config
        })) { throw new Meteor.Error('internal-error', "Internal error."); }

        break;

      case 'emit':
        let event = payload.event;

        return !!Events.insert({
          thing: {
            _id: thing._id
          },
          event: event,
          insertedAt: new Date()
        });
        break;

      case 'setProperty':
        let key = payload.key;
        let value = payload.value;

        thing.properties[key] = value;

        return Things.update(thing._id, {
          $set: {
            'properties': thing.properties
          }
        });
        break;

      default:
        res.end('Hello ' + req.url.split('/')[1] + '\n');
        break;
    }

    res.on('finish', function(err) {
      if(err) {
        console.log(err);
      }
    });
});

server.listen(function() {
  console.log('CoAP server started')
});
