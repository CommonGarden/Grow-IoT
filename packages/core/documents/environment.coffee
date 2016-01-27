class Environment extends share.BaseDocument
  # registeredAt
  # uuid: UUID of the device
  # token: token of the device
  # thing: a model of the device and its api
  # owner:
  #   _id
  # devices: list of (reverse of the Device.environment)
  #   _id
  # plants: list of (reverse of the Plant.environment)
  #   _id
  # rules: list of (reverse of the Rule.environment)
  #   _id


  @Meta
    name: 'Environment'
    fields: =>
      owner: @ReferenceField User, [], false
      deviceCount: @GeneratedField 'self', ['devices'], (fields) =>
        [fields._id, fields.devices?.length or 0]
      plantCount: @GeneratedField 'self', ['plants'], (fields) =>
        [fields._id, fields.plants?.length or 0]
      # notificationCound: @GeneratedField 'self', ['notifications'], (fields) =>
      #   [fields._id, fields.plants?.length or 0]

  getReference: ->
    _.pick @, _.keys @constructor.REFERENCE_FIELDS()

  @REFERENCE_FIELDS: ->
    _id: 1
    uuid: 1
    rule: 1