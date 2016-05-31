let TOKEN_LENGTH = 32;

Meteor.methods({
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


  ['Device.udpateProperty'](auth, componentName,  propertyKey, value) {
    check(auth, {
      uuid: Match.NonEmptyString,
      token: Match.NonEmptyString
    });
    check(componentName, Match.NonEmptyString);
    check(propertyKey, Match.NonEmptyString);

    // TODO: check value... though it could be many things, JSON object, boolean, null, a string, an array.
    // It shouldn't be a function or contain any functions.

    let device = Device.documents.findOne(auth, {
      fields: {
        _id: 1,
        thing: 1
      }
    });
    if (!device) { throw new Meteor.Error('unauthorized', "Unauthorized."); }

    // Update the propery on the thing object
    let { thing } = device;
    for (let key in thing) {
      if (key === 'components') {
        for (let item in thing.components) {
          if (thing.components[item].name === componentName) {
            thing.components[item][propertyKey] = value;
          }
        }
      } else if (thing[key] === componentName) {
        thing[propertyKey] = value;
      }
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


  ['Device.register'](deviceInfo) {
    // TODO: better checks.
    check(deviceInfo, Object);

    let document = {
      uuid: Meteor.uuid(),
      token: Random.id(TOKEN_LENGTH),
      registeredAt: new Date(),
      thing: deviceInfo
    };

    // HACK: should owner be required? Ultimately it would be nice to
    // be able to configure / claim devices from the app.
    try {
      if (deviceInfo.username) {
        if (Meteor.isServer) {
          let user = Accounts.findUserByUsername(deviceInfo.username);
          document.owner = 
            {_id: user._id};
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
  }
});
