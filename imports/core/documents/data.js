import { Mongo } from 'meteor/mongo';

// An Data class that takes a document in its constructor
Data = function (doc) {
  _.extend(this, doc);
};
_.extend(Animal.prototype, {
  makeNoise: function () {
    console.log(this.sound);
  }
});
// Define a Collection that uses Animal as its document
Animals = new Mongo.Collection("Animals", {
  transform: function (doc) { return new Animal(doc); }
});

// class Data extends share.BaseDocument
//   # insertedAt
//   # device: device associated with data
//   #   _id
//   # body

//   @Meta
//     name: 'Data'
//     collection: 'Data'
//     fields: =>
//       device: @ReferenceField Device, Device.REFERENCE_FIELDS()

//     # triggers: =>
//     #   rules: @Trigger ['insertedAt', 'device', 'body'], (newDocument, oldDocument) ->
//     #     # Don't do anything when document is removed
//     #     return unless newDocument?._id
//     #     console.log newDocument
