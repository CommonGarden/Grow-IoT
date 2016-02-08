# # TODO: this should be limited to the user's components.
# new PublishEndpoint 'Component.list', ->
#   Component.documents.find({})
#     # 'owner._id': @userId

# new PublishEndpoint 'Component.one', (componentUuid) ->
#   # TODO: Do better checks.
#   check componentUuid, Match.NonEmptyString

#   Component.documents.find
#     uuid: componentUuid
