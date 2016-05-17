class Thing.DisplayComponent extends UIComponent
  @register 'Thing.DisplayComponent'

  onCreated: ->
    super

    @currentThingUuid = new ComputedField =>
      FlowRouter.getParam 'uuid'

    @thing = new ComputedField =>
      Thing.documents.findOne
        uuid: @currentThingUuid()

    @autorun (computation) =>
      thingUuid = @currentThingUuid()
      return unless thingUuid

      @subscribe 'Thing.one', thingUuid

      # @subscribe 'StorageFile'

      # @subscribe 'Data.points', thingUuid

      # @subscribe 'Events.thing', thingUuid

    @autorun (computation) =>
      return unless @subscriptionsReady()

      thing = Thing.documents.findOne
        uuid: @currentThingUuid()
      ,
        fields:
          title: 1

  thing: ->
    @thing()

  # images: ->
  #   Images.files.find({})

  events: ->
    super.concat
      'click .remove': @remove
      'click .take-pic': @takePic

  takePic: (event) ->
    MeteorCamera.getPicture [], (err, data) ->
      newFile = new FS.File(data)

      # HACK: should do this with referencefields.
      # newFile.thing = Thing.documents.findOne
      #   uuid: FlowRouter.getParam 'uuid'

      Meteor.call 'StorageFile.newFile', newFile, (err, fileObj) ->
        if err
          console.log err
          Bert.alert 'Image save failed.', 'error', 'growl-top-right'
        else
          Bert.alert 'Image saved', 'success', 'growl-top-right'


  notFound: ->
    @subscriptionsReady() and not @thing()

  remove: ->
    thing = @thing()
    if window.confirm("Are you sure you want to delete this thing?")
      Meteor.call 'Thing.remove',
        @currentThingUuid(),
      ,
        (error, documentId) =>
          if error
            console.error "New thingerror", error
            alert "New thingerror: #{error.reason or error}"
          else
            Bert.alert 'Thing deleted.', 'success', 'growl-top-right'
            FlowRouter.go 'Dashboard'
