import coap from 'coap';
import url from 'url';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Fiber from 'fibers';
import _ from 'underscore';
import { Match } from 'meteor/check';

const server = coap.createServer();

server.on('request', function(req, res) {
  let urlParts = url.parse(req.url, true);

  let method = urlParts.pathname.replace(/\//g, '');
  let payload = JSON.parse(req.payload.toString());

  let auth = {
    uuid: payload.uuid,
    token: payload.token
  }

  check(auth, {
    uuid: String,
    token: String
  });
  // Todo: more extensive checks.
  check(payload, Object);

  switch (method) {
    // Rename to subscribe?
    case 'register':
      Fiber(function () {
        let thing = Things.findOne(auth, {
          fields: {
            _id: 1
          }
        });
        if (!thing) { throw new Meteor.Error('unauthorized', "Unauthorized."); }

        let config = _.extend(payload, { registeredAt: new Date() });

        // Update the document
        if (!Things.update(thing._id, {
          $set: config
        })) { throw new Meteor.Error('internal-error', "Internal error."); }

        res.write('Registered:' + new Date().toISOString() + '\n');
      }).run();

      break;

    case 'emit':
      let event = payload.event;
      check(event, Match.OneOf(String, Object));

      Fiber(function () {
        let thing = Things.findOne(auth, {
          fields: {
            _id: 1
          }
        });
        if (!thing) { throw new Meteor.Error('unauthorized', "Unauthorized."); }

        return !!Events.insert({
          thing: {
            _id: thing._id
          },
          event: event,
          insertedAt: new Date()
        });
      }).run();
      break;

    case 'setProperty':
      let key = payload.key;
      let value = payload.value;
      check(key, String);
      check(value, Match.OneOf(String, Number, Boolean, Object));


      Fiber(function () {
        check(auth, {
          uuid: String,
          token: String
        });
        check(key, String);
        check(value, Match.OneOf(String, Number));

        let thing = Things.findOne(auth, {
          fields: {
            _id: 1,
            properties: 1
          }
        });
        if (!thing) { throw new Meteor.Error('unauthorized', "Unauthorized."); }

        thing.properties[key] = value;

        return Things.update(thing._id, {
          $set: {
            'properties': thing.properties
          }
        });
      }).run();
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
})
