class Device.ActionComponent extends Device.DisplayComponent
  @register 'Device.ActionComponent'

  onCreated: ->
    super

    @type = Template.currentData().type

  events: ->
    super.concat
      'click .command': (e) ->
        e.preventDefault()
        type = e.currentTarget.dataset.call
        # OPTIONS NOT WORKING.
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

      'click .schedule': (e) ->
        e.preventDefault()
        # TODO: check with later.js to make sure it's a valid string.
        
