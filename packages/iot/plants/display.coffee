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

      @subscribe 'Data.points', plantUuid

      @subscribe 'Events.plant', plantUuid

    @autorun (computation) =>
      return unless @subscriptionsReady()

      plant = Plant.documents.findOne
        uuid: @currentPlantUuid()
      ,
        fields:
          title: 1

  plant: ->
    @plant()

  thing: ->
    plant = @plant()
    plant.thing

  eventLog: ->
    Events.documents.find
      'plant._id': @plant()?._id
    ,
      'sort':
        'body.timestamp': -1
  
  datapoints: ->
    Data.documents.find
      'plant._id': @plant()?._id

  events: ->
    super.concat
      'click .remove': @remove

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
