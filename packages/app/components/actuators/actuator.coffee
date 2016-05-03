class Device.ActuatorComponent extends Device.DisplayComponent
  @register 'Device.ActuatorComponent'

  onCreated: ->
    super

    @type = Template.currentData().type

  # events: ->
  #   super.concat
  #     'click .command': (e) ->
  #       e.preventDefault()
  #       type = e.currentTarget.dataset.call
  #       # OPTIONS NOT WORKING.
  #       options = e.currentTarget.dataset.options?
  #       Meteor.call 'Device.sendCommand',
  #         @currentDeviceUuid(),
  #         type,
  #         options,
  #       ,
  #         (error, documentId) =>
  #           if error
  #             console.error "New deviceerror", error
  #             alert "New deviceerror: #{error.reason or error}"
