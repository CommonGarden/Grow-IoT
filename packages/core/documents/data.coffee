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
      # component: @ReferenceField Component

    triggers: =>
      rules: @Trigger ['insertedAt', 'device', 'body'], (newDocument, oldDocument) ->
        # Don't do anything when document is removed
        return unless newDocument?._id
        # console.log newDocument

        # Todo: check data against rules, emit notifications if need be.
        # Todo: check for device/component events, and if the user is getting notifications for them.
