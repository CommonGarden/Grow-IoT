import { Mongo } from 'meteor/mongo';

// Create a collection where users can only modify documents that
// they own. Ownership is tracked by an 'owner' field on each
// document. All documents must be owned by the user that created
// them and ownership can't be changed. Only a document's owner
// is allowed to delete it, and the 'locked' attribute can be
// set on a document to prevent its accidental deletion.
Messages = new Mongo.Collection("Messages");
Messages.allow({
  insert: function (userId, doc) {
    // the user must be logged in, and the document must be owned by the user
    return (userId && doc.owner === userId);
  },
  update: function (userId, doc, fields, modifier) {
    // can only change your own documents
    return doc.owner === userId;
  },
  remove: function (userId, doc) {
    // can only remove your own documents
    return doc.owner === userId;
  },
  fetch: ['owner']
});
Messages.deny({
  update: function (userId, doc, fields, modifier) {
    // can't change owners
    return _.contains(fields, 'owner');
  },
  remove: function (userId, doc) {
    // can't remove locked documents
    return doc.locked;
  },
  fetch: ['locked'] // no need to fetch 'owner'
});

// MESSAGES_TTL = 60 # seconds

// class Message extends share.BaseDocument
//   # createdAt: timestamp when created
//   # device: device associated with data
//   #   _id
//   # body

//   @Meta
//     name: 'Message'
//     fields: =>
//       device: @ReferenceField Device

//   @send: (device, message) ->
//     !!@documents.insert
//       createdAt: new Date()
//       device:
//         _id: device._id
//       body: message

// # Auto-expire messages after MESSAGES_TTL seconds.
// Message.Meta.collection._ensureIndex
//   createdAt: 1
// ,
//   expireAfterSeconds: MESSAGES_TTL
