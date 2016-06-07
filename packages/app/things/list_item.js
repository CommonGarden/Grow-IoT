Thing.ListItemComponent = class ListItemComponent extends CommonComponent {
	onCreated() {
		super.onCreated();

		return this.subscribe('Thing.one', Template.currentData().uuid);
	}

	thing() {
		let thing = Thing.documents.findOne(
			{uuid: Template.currentData().uuid});
		return thing.thing;
	}
};

Thing.ListItemComponent.register('Thing.ListItemComponent');
