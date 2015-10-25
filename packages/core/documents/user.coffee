class User extends share.BaseDocument

@Meta
  name: 'User'
  collection: Meteor.users

@REFERENCE_FIELDS: ->
  _id: 1

getReference: ->
  _.pick @, _.keys @constructor.REFERENCE_FIELDS()
