class Dashboard extends CommonComponent {
	onCreated() {
		super.onCreated();

		return this.subscribe('Environment.list');
	}

	environments() {
		return Environment.documents.find(
			{'owner._id': Meteor.userId()});
	}
}

Dashboard.register('Dashboard');
