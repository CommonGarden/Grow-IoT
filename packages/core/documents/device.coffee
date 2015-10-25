class Device extends share.BaseDocument
  @Meta
    name: 'Device'
    fields: =>
      owner: @ReferenceField User, User.REFERENCE_FIELDS()
