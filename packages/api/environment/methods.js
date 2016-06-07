Meteor.methods({
  ['Environment.new'](name) {
    check(name, Match.NonEmptyString);
    
    let document = {
      uuid: Meteor.uuid(),
      name: name,
      // type: insideOrOutside
      owner: { 
        _id: Meteor.userId()
      },
      created: new Date()
    };

    if (!Environment.documents.insert(document)) { throw new Meteor.Error('internal-error', "Internal error."); }

    return document;
  },

  ['Environment.delete'](uuid) {
    check(uuid, Match.NonEmptyString);
    let environment = Environment.documents.findOne({
      'uuid': uuid,
      'owner._id': Meteor.userId()
    });
    if (!environment) { throw new Meteor.Error('unauthorized', "Unauthorized."); }

    return Environment.documents.remove(environment._id);
  }
});
