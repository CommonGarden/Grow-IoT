import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.publish('Thing.messages', function(auth) {
  var Thing, handle, options, query;
  
  check(auth, {
    uuid: Match.NonEmptyString,
    token: Match.NonEmptyString
  });

  Thing = Thing.documents.findOne(auth, {
    fields: {
      _id: 1,
      owner: 1
    }
  });
  if (!Thing) {
    throw new Meteor.Error('unauthorized', "Unauthorized.");
  }
  Thing.documents.update(Thing._id, {
    $set: {
      onlineSince: new Date()
    }
  });
  query = {
    'Thing._id': Thing._id,
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
  handle = Message.documents.find(query, options).observeChanges({
    added: (function(_this) {
      return function(id, fields) {
        _this.added('Thing.messages', id, fields);
        _this.removed('Thing.messages', id);
        return Message.documents.remove(id);
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
        Thing.documents.update({
          _id: Thing._id,
          onlineSince: {
            $lt: new Date(new Date().valueOf() - 5000)
          }
        }, {
          $set: {
            onlineSince: false
          }
        });
        Meteor.call('Thing.emitEvent', auth, {
          name: "offline",
          message: "Thing offline"
        }, function(error, documentId) {
          if (error) {
            return console.error("New Thing.emitEvent Error", error);
          }
        });
        return Meteor.call('Notifications.new', "Thing offline.", Thing.owner._id, function(error, documentId) {
          if (error) {
            return console.error("New Notification Error", error);
          }
        });
      }, 5000);
    };
  })(this));
});

Meteor.publish('Thing.list', function(ThingUuid) {
  return Thing.documents.find({
    'owner._id': this.userId,
  });
});

Meteor.publish('Thing.one', function(ThingUuid) {
  check(ThingUuid, Match.NonEmptyString);
  return Thing.documents.find({
    uuid: ThingUuid
  });
});
