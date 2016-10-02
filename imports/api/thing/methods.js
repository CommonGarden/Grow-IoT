import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.methods({
  'Thing.register': function (auth, config) {
    check(auth, {
      uuid: Match.NonEmptyString,
      token: Match.NonEmptyString
    });
    check(config, Object);

    // Check to see we have that thing and fetch the document.
    let thing = Things.documents.findOne(auth, {
      fields: {
        _id: 1
      }
    });
    if (!thing) { throw new Meteor.Error('unauthorized', "Unauthorized."); }
    
    // Update the document
    if (!Things.update(thing._id, {
      $set: {
        thing: config,
        registeredAt: new Date()
      }
    })) { throw new Meteor.Error('internal-error', "Internal error."); }

    return document;
  },

  /*
   * Creates a new thing with UUID and Token.
  */
  'Thing.new': function () {
    // Must be a logged in user.
    if(Meteor.userId()) {
      let document = {
        'uuid': Meteor.uuid(),
        'token': Random.id(32),
        'owner._id': Meteor.userId()
      };
      if (!Things.insert(document)) { throw new Meteor.Error('internal-error', "Internal error."); }

      return document;
    }
  },

  /*
   * Send data
   * @param auth Authentication object including UUID and token.
   * @param data The data to be stored.
  */
  // 'Thing.sendData': function (auth, data) {
  //   check(auth, {
  //     uuid: Match.NonEmptyString,
  //     token: Match.NonEmptyString
  //   });

  //   let thing = Things.findOne(auth, {
  //     fields: {
  //       _id: 1
  //     }
  //   });
  //   if (!thing) { throw new Meteor.Error('unauthorized', "Unauthorized."); }
    
  //   return !!Events.insert({
  //     thing: {
  //       _id: thing._id
  //     },
  //     data: data,
  //     insertedAt: new Date()
  //   });
  // },

  /*
   * Set property
  */
  'Thing.setProperty': function (auth, property, value, key) {
    check(auth, {
      uuid: Match.NonEmptyString,
      token: Match.NonEmptyString
    });
    check(property, Match.NonEmptyString);
    check(value, Match.NonEmptyString);
    check(key, Match.NonEmptyString);

    let thing = Things.findOne(auth, {
      fields: {
        _id: 1,
        thing: 1
      }
    });
    if (!thing) { throw new Meteor.Error('unauthorized', "Unauthorized."); }

    if (_.isNull(key)) {
      thing.properties[property] = value;
    }
    else if (!_.isUndefined(thing.actions[key])) {
      thing.actions[key][property] = value;
    } else if (!_.isUndefined(thing.events[key])) {
      thing.events[key][property] = value;
    }

    return Things.update(thing._id, {
      $set: {
        'thing': thing
      }
    });
  },

  /*
   * Emit
  */
  'Thing.emit': function (auth, body) {
    check(auth, {
      uuid: Match.NonEmptyString,
      token: Match.NonEmptyString
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
    check(uuid, Match.NonEmptyString);

    let thing = Things.documents.findOne({
      'uuid': uuid,
      'owner._id': Meteor.userId()
    });
    if (!thing) { throw new Meteor.Error('unauthorized', "Unauthorized."); }

    return Things.remove(thing._id);
  }
});
