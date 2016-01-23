class Plant extends share.BaseDocument
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
    name: 'Plant'
    fields: =>
      owner: @ReferenceField User, [], false
      # environment: @ReferenceField Environment, ['uuid']
      # TODO: add @ReferenceField for images featuring the plant.

# class Plant extends Plant
#   @Meta
#     name: 'Plant'
#     replaceParent: true
#     fields: (fields) =>
#       fields.environment = @ReferenceField Environment, [], true, 'plants'
#       fields
