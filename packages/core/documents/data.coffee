class Data extends share.BaseDocument
  # device: device associated with data
  #   _id
  # data

  @Meta
    name: 'Data'
    collection: 'Data'
    fields: =>
      device: @ReferenceField Device
