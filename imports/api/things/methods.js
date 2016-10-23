import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Match } from 'meteor/check';
import { Random } from 'meteor/random';

/*
 * Thing methods
*/
Meteor.methods({
  /*
   * Registers a thing.
  */
  'Thing.register': function (auth, config) {
    check(auth, {
      uuid: String,
      token: String
    });
    check(config, Object);

    // Check to see we have that thing and fetch the document.
    let thing = Things.findOne(auth, {
      fields: {
        _id: 1
      }
    });
    if (!thing) { throw new Meteor.Error('unauthorized', "Unauthorized."); }
    
    // TODO: reorganize... we shouldn't have to write things like thing.thing.name
    // Update the document
    if (!Things.update(thing._id, {
      $set: {
        thing: config,
        registeredAt: new Date()
      }
    })) { throw new Meteor.Error('internal-error', "Internal error."); }

    // return document;
  },

  /*
   * Creates a new thing with UUID and Token.
  */
  'Thing.new': function () {
    // Must be a logged in user.
    if (Meteor.userId()) {
      let document = {
        'uuid': Meteor.uuid(),
        'token': Random.id(32),
        'owner': Meteor.userId()
      };
      if (!Things.insert(document)) { throw new Meteor.Error('internal-error', "Internal error."); }

      return document;
    }
  },

  /*
   * Set property
  */
  'Thing.setProperty': function (auth, key, value) {
    check(auth, {
      uuid: String,
      token: String
    });
    check(key, String);
    check(value, String);

    let thing = Things.findOne(auth, {
      fields: {
        _id: 1,
        thing: 1
      }
    });
    if (!thing) { throw new Meteor.Error('unauthorized', "Unauthorized."); }

    thing.properties[key] = value;

    return Things.update(thing._id, {
      $set: {
        'thing': thing
      }
    });
  },

  /*
   * Emit an event.
  */
  'Thing.event': function (auth, body) {
    check(auth, {
      uuid: String,
      token: String
    });

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
      event: body,
      insertedAt: new Date()
    });
  },

  /*
   * Delete thing.
  */
  'Thing.delete': function (uuid) {
    check(uuid, String);

    // Users can only delete things they own.
    let thing = Things.findOne({
      'uuid': uuid,
      'owner': Meteor.userId()
    });
    if (!thing) { throw new Meteor.Error('unauthorized', "Unauthorized."); }

    return Things.remove(thing._id);
  }
});
