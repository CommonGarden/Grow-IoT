import { Mongo } from 'meteor/mongo';

// class Environment extends share.BaseDocument
//   # registeredAt
//   # uuid: UUID of the device
//   # token: token of the device
//   # thing: a model of the device and its api
//   # owner:
//   #   _id
//   # devices: list of (reverse of the Device.environment)
//   #   _id
//   # things: list of (reverse of the Thing.environment)
//   #   _id
//   # rules: list of (reverse of the Rule.environment)
//   #   _id


//   @Meta
//     name: 'Environment'
//     fields: =>
//       owner: @ReferenceField User, [], false
//       deviceCount: @GeneratedField 'self', ['devices'], (fields) =>
//         [fields._id, fields.devices?.length or 0]
//       thingsCount: @GeneratedField 'self', ['things'], (fields) =>
//         [fields._id, fields.things?.length or 0]
//       # notificationCount: @GeneratedField 'self', ['notifications'], (fields) =>
//       #   [fields._id, fields.things?.length or 0]

//   getReference: ->
//     _.pick @, _.keys @constructor.REFERENCE_FIELDS()

//   @REFERENCE_FIELDS: ->
//     _id: 1
//     uuid: 1
//     rule: 1