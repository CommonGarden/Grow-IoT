let TOKEN_LENGTH = 32;

Meteor.methods({
  ['Device.register'](deviceInfo) {
    // TODO: better checks.
    check(deviceInfo, Object);

    let document = {
      uuid: Meteor.uuid(),
      token: Random.id(TOKEN_LENGTH),
      registeredAt: new Date(),
      thing: deviceInfo
    };

    // TODO: use a UUID
    try {
      if (deviceInfo.username) {
        if (Meteor.isServer) {
          // TODO: MAKE API KEYS. USE THOSE INSTEAD OF EMAIL.
          let user = Accounts.findUserByEmail(deviceInfo.username);
          document.owner = {_id: user._id};
        }
      } else {
        throw new Meteor.Error('internal-error', 'The device has no username. Choose the username of the account you want the device added to.');
      }
    } catch (error) {
      // TODO: better error message
      throw new Meteor.Error('internal-error', 'The device has no username. Choose the username of the account you want the device added to.');
    }

    if (!Device.documents.insert(document)) { throw new Meteor.Error('internal-error', "Internal error."); }

    return document;
  },


  ['Device.sendData'](auth, body) {
    check(auth, {
      uuid: Match.NonEmptyString,
      token: Match.NonEmptyString
    });

    let device = Device.documents.findOne(auth, {
      fields: {
        _id: 1
      }
    });
    if (!device) { throw new Meteor.Error('unauthorized', "Unauthorized."); }
    
    return !!Data.documents.insert({
      device: {
        _id: device._id
      },
      data: body,
      insertedAt: new Date()
    });
  },


  // Modify to update a property from the client side?
  // Example, updating the schedule of an action schedule...
  ['Device.setProperty'](auth, property, value, key) {
    check(auth, {
      uuid: Match.NonEmptyString,
      token: Match.NonEmptyString
    });
    check(property, Match.NonEmptyString);
    check(value, Match.NonEmptyString);
    // if (!_.isNull(key) ) {
    // check(key, Match.NonEmptyString);
    // }

    let device = Device.documents.findOne(auth, {
      fields: {
        _id: 1,
        thing: 1
      }
    });
    if (!device) { throw new Meteor.Error('unauthorized', "Unauthorized."); }

    // Update the propery on the thing object
    let { thing } = device;

    // Hack:
    // thing.actions[key][property] = value;
    // // console.log(thing.actions[key]);
    // console.log(thing.events[key]);
    // console.log(thing.properties[key]);

    // Not working...
    if (_.isNull(key)) {
      thing.properties[property] = value;
    }
    else if (!_.isUndefined(thing.actions[key])) {
      thing.actions[key][property] = value;
    } else if (!_.isUndefined(thing.events[key])) {
      thing.events[key][property] = value;
    }

    // Set the new thing object
    return Device.documents.update(device._id, {
      $set: {
        'thing': thing
      }
    });
  },


  ['Device.emitEvent'](auth, body) {
    check(auth, {
      uuid: Match.NonEmptyString,
      token: Match.NonEmptyString
    });

    let device = Device.documents.findOne(auth, {
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


  ['Device.assignEnvironment'](deviceUuid, environmentUuid) {
    check(deviceUuid, Match.NonEmptyString);
    check(environmentUuid, Match.NonEmptyString);

    let device = Device.documents.findOne({
      'uuid': deviceUuid,
      'owner._id': Meteor.userId()
    });
    let environment = Environment.documents.findOne(
      {'uuid': environmentUuid});

    if (!environment) { throw new Meteor.Error('unauthorized', "Unauthorized."); }

    return Device.documents.update(device._id, {
      '$set': {
        'environment':
          environment.getReference()
      }
    });
  },


  ['Device.unassignEnvironment'](deviceUuid, environmentUuid) {
    check(deviceUuid, Match.NonEmptyString);
    check(environmentUuid, Match.NonEmptyString);

    let device = Device.documents.findOne({
      'uuid': deviceUuid,
      'owner._id': Meteor.userId()
    });
    let environment = Environment.documents.findOne(
      {'uuid': environmentUuid});

    return Device.documents.update(device._id, {
      '$unset': {
        'environment': ""
      }
    });
  },


  ['Device.claim'](deviceUuid, environmentUuid) {
    check(deviceUuid, Match.NonEmptyString);
    check(environmentUuid, Match.NonEmptyString);

    // TODO: make sure this doesn't work for devices with an owner.
    let device = Device.documents.findOne(
      {'uuid': deviceUuid});
    let environment = Environment.documents.findOne(
      {'uuid': environmentUuid});

    return Device.documents.update(device._id, {
      '$set': {
        'owner._id': Meteor.userId(),
        'environment':
          environment.getReference()
      }
    });
  },


  ['Device.remove'](uuid) {
    check(uuid, Match.NonEmptyString);

    let device = Device.documents.findOne({
      'uuid': uuid,
      'owner._id': Meteor.userId()
    });
    if (!device) { throw new Meteor.Error('unauthorized', "Unauthorized."); }

    return Device.documents.remove(device._id);
  },

  ['Device.getTime'](auth) {
    check(auth, {
      uuid: Match.NonEmptyString,
      token: Match.NonEmptyString
    });

    let device = Device.documents.findOne(auth, {
      fields: {
        _id: 1
      }
    });
    if (!device) { throw new Meteor.Error('unauthorized', "Unauthorized."); }

    return new Date();
  }
});
