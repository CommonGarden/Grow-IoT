class Component.DisplayComponent extends Device.DisplayComponent
  @register 'Component.DisplayComponent'

  onCreated: ->
    super

    # @type = Template.currentData().type

    @subscribe 'Component.one', Template.currentData().uuid

    # @components = new ComputedField =>
    #   @device().thing.components

  component: ->
    Component.documents.findOne
      "uuid": Template.currentData().uuid

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

  onRendered: ->
    super

    # uuid = @currentDeviceUuid()
    # for actuator in @actuators()
    #   crons = actuator.model.properties[0].crons
    #   for cron in crons
    #   	$ ($) ->
    #       $('#' + cron.name).cron
    #         initial: cron.cron
    #         onChange: ->
    #           options = {}
    #           options.actuatorName = actuator.name
    #           options.cron = $(this).cron('value')
    #           options.cronName = cron.name
    #           Meteor.call 'Device.sendCommand',
    #             uuid,
    #             'update-crons',
    #             options,
    #           ,
    #             (error, documentId) =>
    #               if error
    #                 console.error "New deviceerror", error
    #                 alert "New deviceerror: #{error.reason or error}"
    #           # TODO: update crons in the device document.
