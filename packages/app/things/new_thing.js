Thing.NewComponent = class NewComponent extends CommonComponent {
	onCreated() {
		super.onCreated();

		this.currentEnvironmentUuid = new ComputedField(() => {
			return FlowRouter.getParam('uuid');
		});

		return this.subscribe('Environment.one', this.currentEnvironmentUuid());
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

		let currentEnvironmentUuid = new ComputedField(() => {
			return FlowRouter.getParam('uuid');
		});

		return $('#newThing').validate({
			rules: {
				name: {
					required: true
				},
				description: {
					required: true
				}
			},
			messages: {
				name: {
					required: "Please give this thing a name."
				},
				description: {
					required: "Please give this thing a short description."
				}
			},

			submitHandler() {
				let thing = {
					name: $('#thingName').val(),
					description: $('#description').val()
				};

				return Meteor.call('Thing.new',
					thing,
					currentEnvironmentUuid(),
					(error, documentId) => {
						if (error) {
							return console.log(error);
						} else {
							let params = { uuid: currentEnvironmentUuid() };
							let path = FlowRouter.path('Environment.DisplayComponent', params);
							return FlowRouter.go(path);
						}
					});
			}
		});
	}
};

Thing.NewComponent.register('Thing.NewComponent');
