# class Component extends share.BaseDocument
#   # registeredAt
#   # uuid: UUID of the component
#   # token: token of the component
#   # thing: a model of the component and its api
#   # owner:
#   #   _id
#   # environment: the place a thing belongs too.
#   #   _id
#   # onlineSince

#   @Meta
#     name: 'Component'
#     fields: =>
#       owner: @ReferenceField User, [], false
#       environment: @ReferenceField Environment, Environment.REFERENCE_FIELDS(), false, 'components'
#       device: @ReferenceField Device, Device.REFERENCE_FIELDS(), false, 'components'

#   getReference: ->
#     _.pick @, _.keys @constructor.REFERENCE_FIELDS()

#   @REFERENCE_FIELDS: ->
#     _id: 1
#     uuid: 1
#     # rule: 1