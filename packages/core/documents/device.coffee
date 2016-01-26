class Device extends share.BaseDocument
  # registeredAt
  # uuid: UUID of the device
  # token: token of the device
  # thing: a model of the device and its api
  # owner:
  #   _id
  # environment: the place a thing belongs too.
  #   _id
  # onlineSince

  @Meta
    name: 'Device'
    fields: =>
      owner: @ReferenceField User, [], false
      environment: @ReferenceField Environment, Environment.REFERENCE_FIELDS(), false, 'devices'

  getReference: ->
    _.pick @, _.keys @constructor.REFERENCE_FIELDS()

  @REFERENCE_FIELDS: ->
    _id: 1
    uuid: 1
    # rule: 1