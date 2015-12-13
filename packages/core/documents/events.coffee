class Events extends share.BaseDocument
  # insertedAt
  # device: device associated with data
  #   _id
  # body

  @Meta
    name: 'Events'
    collection: 'Events'
    fields: =>
      device: @ReferenceField Device
