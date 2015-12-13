# TODO: Notifications are different from events, because not every event will lead to notifications.
class Notification extends share.BaseDocument
  # insertedAt
  # device: device associated with data
  #   _id
  # body

  @Meta
    name: 'Notification'
    collection: 'Notification'
    fields: =>
      device: @ReferenceField Device
