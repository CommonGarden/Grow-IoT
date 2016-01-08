class Environment extends share.BaseDocument
  # registeredAt
  # uuid: UUID of the device
  # token: token of the device
  # thing: a model of the device and its api
  # owner:
  #   _id

  @Meta
    name: 'Environment'
    fields: =>
      owner: @ReferenceField User, [], false
      # devices: [@ReferenceField Device, ['uuid', 'thing']]
