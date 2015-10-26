class Data extends share.BaseDocument
  # insertedAt
  # device: device associated with data
  #   _id
  # body

  @Meta
    name: 'Data'
    collection: 'Data'
    fields: =>
      device: @ReferenceField Device
