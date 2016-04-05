class Plant.DisplayComponent extends UIComponent
  @register 'Plant.DisplayComponent'

  onCreated: ->
    super

    @currentPlantUuid = new ComputedField =>
      FlowRouter.getParam 'uuid'

    @plant = new ComputedField =>
      Plant.documents.findOne
        uuid: @currentPlantUuid()

    @autorun (computation) =>
      plantUuid = @currentPlantUuid()
      return unless plantUuid

      @subscribe 'Plant.one', plantUuid

      # @subscribe 'StorageFile'

      # @subscribe 'Data.points', plantUuid

      # @subscribe 'Events.plant', plantUuid

    @autorun (computation) =>
      return unless @subscriptionsReady()

      plant = Plant.documents.findOne
        uuid: @currentPlantUuid()
      ,
        fields:
          title: 1

  # plant: ->
  #   @plant()

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
      # newFile.plant = Plant.documents.findOne
      #   uuid: FlowRouter.getParam 'uuid'

      # Todo: create our own method.
      Meteor.call 'StorageFile.new', newFile, (err, fileObj) ->
        if err
          console.log err
          Bert.alert 'Image save failed.', 'error', 'growl-top-right'
        else
          Bert.alert 'Image saved', 'success', 'growl-top-right'


  notFound: ->
    @subscriptionsReady() and not @plant()

  remove: ->
    plant = @plant()
    if window.confirm("Are you sure you want to delete this plant?")
      Meteor.call 'Plant.remove',
        @currentPlantUuid(),
      ,
        (error, documentId) =>
          if error
            console.error "New planterror", error
            alert "New planterror: #{error.reason or error}"
          else
            Bert.alert 'Plant deleted.', 'success', 'growl-top-right'
            FlowRouter.go 'Dashboard'
