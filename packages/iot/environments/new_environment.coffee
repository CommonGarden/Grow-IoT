class Environment.NewComponent extends UIComponent
  @register 'Environment.NewComponent'

  onCreated: ->
    super

  events: ->
    super.concat
      'submit form': @newEnvironment

  # TODO: Validate form.
  newEnvironment: (event) ->
    event.preventDefault()
    console.log "Called."

    name = "Patio"

    Meteor.call 'Environment.new',
      name,
      Meteor.userId(),
    ,
      (error, documentId) =>
        if error
          console.error "New enivironmenterror", error
          alert "New enivironmenterror: #{error.reason or error}"
          return

        FlowRouter.go 'Dashboard'
