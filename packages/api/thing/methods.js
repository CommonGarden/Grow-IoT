Meteor.methods({
  ['Thing.new'](thing, environmentUuid) {
    // TODO: checks.
    check(thing, Object);
    check(environmentUuid, Match.NonEmptyString);

    let environment = Environment.documents.findOne(
      {uuid: environmentUuid});

    let document = {
      uuid: Meteor.uuid(),
      thing: thing,
      environment:
        environment.getReference(),
      owner: {
        _id: Meteor.userId()
      },
      timestamp: new Date()
    };

    if (!Thing.documents.insert(document)) { throw new Meteor.Error('internal-error', "Internal error."); }
  },

  ['Thing.remove'](uuid) {
    let thing = Thing.documents.findOne({
      'uuid': uuid,
      'owner._id': Meteor.userId()
    });

    return Thing.documents.remove(thing._id);
  },


  // Todo: Thing.edit
  ['Thing.edit'](uuid) {}
});