import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

Meteor.publish('Thing.messages', function(auth) {
  var thing, handle, options, query;

  check(auth, {
    uuid: String,
    token: String
  });

  thing = Things.findOne(auth, {
    fields: {
      _id: 1,
      owner: 1
    }
  });

  if (!thing) {
    throw new Meteor.Error('unauthorized', "Unauthorized.");
  }

  Things.update(thing._id, {
    $set: {
      onlineSince: new Date()
    }
  });

  query = {
    'thing._id': thing._id,
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
        _this.added('Things.messages', id, fields);
        _this.removed('Things.messages', id);
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
        Things.update({
          _id: thing._id,
          onlineSince: {
            $lt: new Date(new Date().valueOf() - 5000)
          }
        }, {
          $set: {
            onlineSince: false
          }
        });
        Meteor.call('Thing.emit', auth, {
          message: "Thing offline"
        }, function(error, documentId) {
          if (error) {
            return console.error("New Thing.event Error", error);
          }
        });
      }, 5000);
    };
  })(this));
});

Meteor.publish('Things.list', function() {
  return Things.find({
    owner: this.userId
  });
});

Meteor.publish('Things.one', function(ThingUuid) {
  check(ThingUuid, String);
  return Things.find({
    uuid: ThingUuid,
    owner: this.userId
  });
});

Meteor.publish('Thing.events', function(uuid, type, l) {
  check(uuid, String);
  check(type, Match.OneOf(String, undefined));
  check(l, Match.OneOf(Number, undefined));

  let thing = Things.findOne({
    'uuid': uuid,
    'owner': this.userId
  }
    , {
      fields: {
        _id: 1
      }
    });

  if (!thing) { throw new Meteor.Error('not-found', `Thing '${uuid}' cannot be found.`); }

  const limit = l || 100;
  if (type === undefined) {
    return Events.find(
      {'thing._id': thing._id}
      , {
        'sort': {
          'insertedAt': -1
        },
        limit
      });
  }

  if (type) {
    return Events.find({
      'thing._id': thing._id,
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

Meteor.publish('Thing.images', function (uuid, l) {
  check(uuid, String);
  check(l, Number);

  let thing = Things.findOne({
    'uuid': uuid,
    'owner': this.userId
  }
  , {
    fields: {
      _id: 1
    }
  });

  if (!thing) throw new Meteor.Error('unauthorized', "Unauthorized.");

  const limit = l || 10;
  return Images.find(
    {'meta.thing': thing._id}
    , {
      'sort': {
        'meta.insertedAt': -1
      },
      limit
    }).cursor;
});

