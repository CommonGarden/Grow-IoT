class Environment.NewComponent extends UIComponent
  @register 'Environment.NewComponent'

  onCreated: ->
    super

  events: ->
    super.concat
      'submit form': (e)->
        # Prevent form submission so it's deferred to our validator.
        e.preventDefault()

  onRendered: ->
    super

    $('#New-Environment').validate
      rules:
        name:
          required: true
      messages:
        emailAddress:
          required: "Please enter a name."
      submitHandler: ->
        name = $('#environment-name').val()
        Meteor.call 'Environment.new',
          name,
          Meteor.userId(),
        ,
          (error, documentId) =>
            if error
              console.error "New enivironmenterror", error
              alert "New enivironmenterror: #{error.reason or error}"
              return

            params = { uuid: documentId.uuid }
            path = FlowRouter.path('Environment.display', params)
            FlowRouter.go path
