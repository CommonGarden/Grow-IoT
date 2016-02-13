# Maybe this should just be a base class that the others inherit from?

class Device.Component extends Device.DisplayComponent
  @register 'Device.Component'

  # This could be just be in charge of loading the right template?

  # Components could eventually include their own templates.

  onCreated: ->
    super

    # Perhaps all visualization components can eventually inherit from this class
    # then real time visualization can become a package of it's own.

    @type = Template.currentData().type
    @class = Template.currentData().class

    console.log @class
    console.log @type

    if @class == "sensor"
      @sensor = true

    if @class == "actuator"
      @actuator = true

  events: ->
    super.concat
      'click .command': (e) ->
        e.preventDefault()
        console.log "called."
        type = e.currentTarget.dataset.call
        options = e.currentTarget.dataset.options?
        Meteor.call 'Device.sendCommand',
          @currentDeviceUuid(),
          type,
          options,
        ,
          (error, documentId) =>
            if error
              console.error "New deviceerror", error
              alert "New deviceerror: #{error.reason or error}"
