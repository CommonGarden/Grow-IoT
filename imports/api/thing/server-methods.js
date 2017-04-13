import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Match } from 'meteor/check';
import influx from '../influx/influx';

const INFLUX_URL = process.env.METEOR_SETTINGS ? JSON.parse(process.env.METEOR_SETTINGS).INFLUX_URL : false;

Meteor.methods({
  'Thing.sendCommand': function (thingUuid, type, options) {
    check(thingUuid, String);
    check(type, String);
    check(options, Object);

    // Must be owner of the device.
    let thing = Things.findOne(
      {uuid: thingUuid}
    , {
      fields: {
        _id: 1
      }
    });

    if (!thing) { throw new Meteor.Error('not-found', `Thing '${thingUuid}' cannot be found.`); }

    let document = {
      createdAt: new Date(),
      thing: {
        _id: thing._id
      },
      body: {
        type: type,
        options: options
      }
    }

    Messages.insert(document);
  },

  /*
   * Emit an event.
  */
  'Thing.emit': function (auth, event) {
    check(auth, {
      uuid: String,
      token: String
    });
    check(event, Match.OneOf(String, {
      type: String,
      value: Number
    }));

    let thing = Things.findOne(auth, {
      fields: {
        _id: 1
      }
    });
    if (!thing) { throw new Meteor.Error('unauthorized', "Unauthorized."); }

    if (INFLUX_URL) {
      influx.writePoints([
        {
          measurement: 'events',
          tags: { thing: thing._id, type: event.type ? event.type: event },
          fields: { value: event.value ? event.value: event},
        }
      ]).catch(err => {
        // TODO: if an InfluxDB host is not configured fall back gracefully to using mongo.
        if (err.message !== 'No host available') {
          if (err.errno !== 'ECONNREFUSED') console.error(`Error saving data to InfluxDB! ${err.stack}`);
        }
      })
    }
    
    return !!Events.insert({
      thing: {
        _id: thing._id
      },
      event: event,
      insertedAt: new Date()
    });
  },

});
