class LoginComponent extends UIComponent
  @register 'LoginComponent'

  onCreated: ->
    super

  events: ->
    super.concat
      'click .btn-create-account': ->
        # When the user clicks "Create Account," set a session variable
        # to use later in our submitHandler (above).
        Session.set 'createOrSignIn', 'create'

      'click .btn-sign-in': ->
        # When the user clicks "Sign In," set a session variable
        # to use later in our submitHandler (above).
        Session.set 'createOrSignIn', 'signin'

      'submit form': (e)->
        # Prevent form submission so it's deferred to our validator.
        e.preventDefault()

  onRendered: ->
    super

    $('#sign-in-with-email').validate
      rules:
        emailAddress:
          required: true
          email: true
        password:
          required: true
      messages:
        emailAddress:
          required: "Please enter an email address."
          email: "Please enter a valid email address."
        password:
          required: "Please enter a password."
      submitHandler: ->
        # Once our validation passes, we need to make a decision on
        # whether we want to sign the user up, or, log them in. To do
        # this, we look at a session variable `createOrSignIn` to
        # see which path to take. This is set below in our event handler.
        createOrSignIn = Session.get 'createOrSignIn'

        # Get our user's information before we test as we'll use the same
        # information for both our account creation and sign in.
        user =
          email: $('[name="emailAddress"]').val()
          password: $('[name="password"]').val()

        # Take the correct path according to what the user clicked and
        # our session variable is equal to.
        if createOrSignIn == "create"
          Accounts.createUser user, (error)->
            if error
              # If the user is already registered they may have pressed the wrong button.
              if error.reason == "Email already exists."
                # We try to login instead.
                Meteor.loginWithPassword user.email, user.password, (error)->
                  if error
                    alert error.reason
                  else
                    Bert.alert 'Login successful. Welcome back!', 'success', 'growl-top-right'
                    FlowRouter.go 'Dashboard'
              else
                alert error.reason

            else
              Bert.alert 'Welcome to Common Garden', 'success', 'growl-top-right'
              FlowRouter.go 'Dashboard'

        else
          Meteor.loginWithPassword user.email, user.password, (error)->
            if error
              alert error.reason
            else
              Bert.alert 'Login successful. Welcome back!', 'success', 'growl-top-right'
              FlowRouter.go 'Dashboard'
