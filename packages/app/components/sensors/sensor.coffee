class Device.SensorComponent extends Device.DisplayComponent
  @register 'Device.SensorComponent'

  onCreated: ->
    super

    @type = Template.currentData().type
    # @class = Template.currentData().class

  events: ->
    super.concat
      'click .command': (e) ->
        e.preventDefault()
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
