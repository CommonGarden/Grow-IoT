import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

Meteor.publish('Environment.messages', function(auth) {
  let environment, handle, options, query;

  check(auth, {
    uuid: String,
    token: String
  });

  environment = Environments.findOne(auth, {
    fields: {
      _id: 1,
      owner: 1
    }
  });

  if (!environment) {
    throw new Meteor.Error('unauthorized', "Unauthorized.");
  }

  Environments.update(environment._id, {
    $set: {
      onlineSince: new Date()
    }
  });

  query = {
    'environment._id': environment._id,
    createdAt: {
      $gte: new Date()
    }
  };

  options = {
    fields: {
      body: 1
    },
    sort: {
      createdAt: 1
    }
  };

  handle = Messages.find(query, options).observeChanges({
    added: (function(_this) {
      return function(id, fields) {
        _this.added('Environments.messages', id, fields);
        _this.removed('Environments.messages', id);
        return Messages.remove(id);
      };
    })(this)
  });

  this.ready();

  return this.onStop((function(_this) {
    return function() {
      if (handle != null) {
        handle.stop();
      }
      handle = null;
      return Meteor.setTimeout(function() {
        Environments.update({
          _id: environment._id,
          onlineSince: {
            $lt: new Date(new Date().valueOf() - 5000)
          }
        }, {
          $set: {
            onlineSince: false
          }
        });
        Meteor.call('Environment.emit', auth, {
          message: "Environment offline"
        }, function(error, documentId) {
          if (error) {
            return console.error("New Environment.event Error", error);
          }
        });
      }, 5000);
    };
  })(this));
});

Meteor.publish('Environments.list', function() {
  return Environments.find({
    owner: this.userId
  });
});

Meteor.publish('Environments.one', function(EnvironmentUuid) {
  check(EnvironmentUuid, String);
  return Environments.find({
    uuid: EnvironmentUuid,
    owner: this.userId
  });
});

Meteor.publish('Environment.events', function(uuid, type, l) {
  check(uuid, String);
  check(type, Match.OneOf(String, undefined));
  check(l, Match.OneOf(Number, undefined));

  let environment = Environments.findOne({
    'uuid': uuid,
    'owner': this.userId
  }
    , {
      fields: {
        _id: 1
      }
    });

  if (!environment) { throw new Meteor.Error('not-found', `Environment '${uuid}' cannot be found.`); }

  const limit = l || 100;
  if (type === undefined) {
    return Events.find(
      {'environment._id': environment._id}
      , {
        'sort': {
          'insertedAt': -1
        },
        limit
      });
  }

  if (type) {
    return Events.find({
      'environment._id': environment._id,
      'event.type': type,
    }
      , {
        'sort': {
          'insertedAt': -1
        },
        limit
      });
  }
});

// Meteor.publish('Environment.images', function (uuid, l) {
//   check(uuid, String);
//   check(l, Number);

//   let environment = Environments.findOne({
//     'uuid': uuid,
//     'owner': this.userId
//   }
//   , {
//     fields: {
//       _id: 1
//     }
//   });

//   if (!environment) throw new Meteor.Error('unauthorized', "Unauthorized.");

//   const limit = l || 10;
//   return Images.find(
//     {'meta.environment': environment._id}
//     , {
//       'sort': {
//         'meta.insertedAt': -1
//       },
//       limit
//     }).cursor;
// });

