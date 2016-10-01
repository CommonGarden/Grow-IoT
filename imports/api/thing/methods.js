import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.methods({
  register: function (config) {
    check(config, Object);

    let document = {
      // uuid: Meteor.uuid(),
      token: Random.id(32),
      registeredAt: new Date(),
      thing: config
    };

    try {
      if (config.uuid) {
        if (Meteor.isServer) {
          // TODO: MAKE API KEYS. USE THOSE INSTEAD OF EMAIL.
          // let user = Accounts.findUserByEmail(config.username);
          // document.owner = {_id: user._id};
        }
      } else {
        throw new Meteor.Error('internal-error', 'The device has no username. Choose the username of the account you want the device added to.');
      }
    } catch (error) {
      // TODO: better error message
      throw new Meteor.Error('internal-error', 'The device has no username. Choose the username of the account you want the device added to.');
    }

    if (!Things.insert(document)) { throw new Meteor.Error('internal-error', "Internal error."); }

    // todo: update thing info if it has been changed?

    return document;
  },


  sendData: function (auth, body) {
    check(auth, {
      uuid: Match.NonEmptyString,
      token: Match.NonEmptyString
    });

    let device = Things.documents.findOne(auth, {
      fields: {
        _id: 1
      }
    });
    if (!device) { throw new Meteor.Error('unauthorized', "Unauthorized."); }
    
    return !!Events.insert({
      device: {
        _id: device._id
      },
      data: body,
      insertedAt: new Date()
    });
  },


  // Modify to update a property from the client side?
  // Example, updating the schedule of an action schedule...
  setProperty: function (auth, property, value, key) {
    check(auth, {
      uuid: Match.NonEmptyString,
      token: Match.NonEmptyString
    });
    check(property, Match.NonEmptyString);
    check(value, Match.NonEmptyString);
    check(key, Match.NonEmptyString);

    let device = Things.documents.findOne(auth, {
      fields: {
        _id: 1,
        thing: 1
      }
    });
    if (!device) { throw new Meteor.Error('unauthorized', "Unauthorized."); }

    // Update the propery on the thing object
    let { thing } = device;

    // TODO: use thing.js
    if (_.isNull(key)) {
      thing.properties[property] = value;
    }
    else if (!_.isUndefined(thing.actions[key])) {
      thing.actions[key][property] = value;
    } else if (!_.isUndefined(thing.events[key])) {
      thing.events[key][property] = value;
    }

    // Set the new thing object
    return Things.documents.update(device._id, {
      $set: {
        'thing': thing
      }
    });
  },


  emit: function (auth, body) {
    check(auth, {
      uuid: Match.NonEmptyString,
      token: Match.NonEmptyString
    });

    let device = Things.documents.findOne(auth, {
      fields: {
        _id: 1
      }
    });
    if (!device) { throw new Meteor.Error('unauthorized', "Unauthorized."); }

    return !!Data.documents.insert({
      device: {
        _id: device._id
      },
      event: body,
      insertedAt: new Date()
    });
  },

  remove: function (uuid) {
    check(uuid, Match.NonEmptyString);

    let device = Things.documents.findOne({
      'uuid': uuid,
      'owner._id': Meteor.userId()
    });
    if (!device) { throw new Meteor.Error('unauthorized', "Unauthorized."); }

    return Things.documents.remove(device._id);
  }
});
