import coap from 'coap';
import url from 'url';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Fiber from 'fibers';
import _ from 'underscore';
import { Match } from 'meteor/check';

const server = coap.createServer();

server.on('request', function(req, res) {
  Fiber(function () {
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

    let thing = Things.findOne(auth, {
      fields: {
        _id: 1,
        properties: 1
      }
    });
    if (!thing) { throw new Meteor.Error('unauthorized', "Unauthorized."); }

    // Todo: more extensive checks.
    check(payload, Object);

    switch (method) {
      case 'register':
        let config = _.extend(payload, { registeredAt: new Date() });

        // Update the document
        if (!Things.update(thing._id, {
          $set: config
        })) { throw new Meteor.Error('internal-error', "Internal error."); }

        // See publish.js for more ideas on returning messages.... this isn't working as well as it does with ddp.
        let query = {
          'thing._id': thing._id,
          createdAt: {
            $gte: new Date()
          }
        };

        let options = {
          fields: {
            body: 1
          },
          sort: {
            createdAt: 1
          }
        };

        let handle = Messages.find(query, options).observeChanges({
          added: function (id, fields) {
            res.write(JSON.stringify(fields));
            return Messages.remove(id);
          }
        });
        break;

      case 'emit':
        let event = payload.event;
        check(event, Match.OneOf(String, Object));

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
        check(key, String);
        check(value, Match.OneOf(String, Number, Boolean, Object));

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

  }).run();
});

server.listen(function() {
  console.log('CoAP server started')
});
