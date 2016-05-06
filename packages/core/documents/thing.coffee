class Thing extends share.BaseDocument
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
    name: 'Thing'
    fields: =>
      owner: @ReferenceField User, [], false
      environment: @ReferenceField Environment, Environment.REFERENCE_FIELDS(), false, 'things'
