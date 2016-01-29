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

    triggers: =>
      rules: @Trigger ['insertedAt', 'device', 'body'], (newDocument, oldDocument) ->
        # Don't do anything when document is removed
        return unless newDocument?._id
        # console.log newDocument
