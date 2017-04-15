import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Match } from 'meteor/check';
import { Random } from 'meteor/random';
import { EJSON } from 'meteor/ejson';

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
    

    config = _.extend(config, { registeredAt: new Date() });

    // Update the document
    if (!Things.update(thing._id, {
      $set: config
    })) { throw new Meteor.Error('internal-error', "Internal error."); }
  },

  /*
   * Creates a new thing with UUID and Token.
  */
  'Thing.new': function (thing) {
    check(thing, Match.OneOf(Object, undefined));
    // Must be a logged in user. Anyone want to do a security audit?
    if (Meteor.userId()) {
      let document = {
        'uuid': Meteor.uuid(),
        'token': Random.id(32),
        'owner': Meteor.userId(),
        thing,
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
    check(value, Match.OneOf(String, Number, Object, Boolean));

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
  },

  /*
   * Delete thing.
  */
  'Thing.delete': function (uuid) {
    check(uuid, String);

    // Users can only delete things they own... someone please audit this...
    let thing = Things.findOne({
      'uuid': uuid,
      'owner': Meteor.userId()
    });
    if (!thing) { throw new Meteor.Error('unauthorized', "Unauthorized."); }

    return Things.remove(thing._id);
  },
});