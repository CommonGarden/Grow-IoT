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
        name:
          required: "Please enter a name."
      submitHandler: ->
        name = $('#environment-name').val()
        Meteor.call 'Environment.new',
          name,
        ,
          (error, documentId) =>
            if error
              console.error "New enivironmenterror", error
              alert "New enivironmenterror: #{error.reason or error}"
              return

            Bert.alert 'Environment ' + name + ' created.', 'success', 'growl-top-right'
            params = { uuid: documentId.uuid }
            path = FlowRouter.path('Environment.DisplayComponent', params)
            FlowRouter.go path
