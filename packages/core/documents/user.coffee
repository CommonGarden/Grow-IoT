class User extends share.BaseDocument
  @Meta
    name: 'User'
    collection: Meteor.users

  @REFERENCE_FIELDS: ->
    _id: 1

  getReference: ->
    _.pick @, _.keys @constructor.REFERENCE_FIELDS()

Meteor.user = (userId, fields) ->
  if not fields and _.isObject userId
    fields = userId
    userId = null

  # Meteor.userId is reactive
  userId ?= Meteor.userId()
  fields ?= {}

  return null unless userId

  User.documents.findOne
    _id: userId
  ,
    fields: fields
