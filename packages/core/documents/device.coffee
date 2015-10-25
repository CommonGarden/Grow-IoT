class Device extends share.BaseDocument
  # uuid: UUID of the device
  # token: token of the device
  # owner:
  #   _id

  @Meta
    name: 'Device'
    fields: =>
      owner: @ReferenceField User
