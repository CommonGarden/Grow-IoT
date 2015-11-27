class Device extends share.BaseDocument
  # registeredAt
  # uuid: UUID of the device
  # token: token of the device
  # owner:
  #   _id
  # onlineSince

  @Meta
    name: 'Device'
    fields: =>
      # TODO: make this more secure.
      owner: @ReferenceField User, [], false
