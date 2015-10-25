MESSAGES_TTL = 60 # seconds

class Message extends share.BaseDocument
  # createdAt: timestamp when created
  # device: device associated with data
  #   _id
  # body

  @Meta
    name: 'Message'
    fields: =>
      device: @ReferenceField Device

  @send: (device, message) ->
    !!@documents.insert
      createdAt: new Date()
      device:
        _id: device._id
      body: message

# Auto-expire messages after MESSAGES_TTL seconds.
Messages.Meta.collection._ensureIndex
  createdAt: 1
,
  expireAfterSeconds: MESSAGES_TTL
