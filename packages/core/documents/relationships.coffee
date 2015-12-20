class Relationships extends share.BaseDocument
  # insertedAt
  # device: device associated with data
  #   _id
  # body

  @Meta
    name: 'Relationships'
    collection: 'Relationships'
    fields: =>
      device: @ReferenceField Device
