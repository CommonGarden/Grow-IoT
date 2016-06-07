Environment.NewComponent = class NewComponent extends CommonComponent {
  onCreated() {
    return super.onCreated();
  }

  events() {
    return super.events().concat({
      ['submit form'](e){
        // Prevent form submission so it's deferred to our validator.
        return e.preventDefault();
      }
    });
  }

  onRendered() {
    super.onRendered();

    return $('#New-Environment').validate({
      rules: {
        name: {
          required: true
        }
      },
      messages: {
        name: {
          required: "Please enter a name."
        }
      },
      submitHandler() {
        let name = $('#environment-name').val();
        return Meteor.call('Environment.new',
          name,
          (error, documentId) => {
            if (error) {
              console.error("New enivironmenterror", error);
              alert(`New enivironmenterror: ${error.reason || error}`);
              return;
            }

            Bert.alert(`Environment ${name} created.`, 'success', 'growl-top-right');
            let params = { uuid: documentId.uuid };
            let path = FlowRouter.path('Environment.DisplayComponent', params);
            return FlowRouter.go(path);
          });
      }
    });
  }
};

Environment.NewComponent.register('Environment.NewComponent');
