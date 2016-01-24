# Todo: adjust permissions.
Images.deny
  insert: ->
    false
  update: ->
    false
  remove: ->
    false
  download: ->
    false
Images.allow
  insert: ->
    true
  update: ->
    true
  remove: ->
    true
  download: ->
    true

new PublishEndpoint 'Images.one', ->
  Images.files.find {}
