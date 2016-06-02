class HeaderComponent extends UIComponent {
  onCreated() {
    return super.onCreated();
}

  events() {
    return super.events().concat(
      {'click .logout': this.onLogout});
  }

  onLogout(event) {
    event.preventDefault();
    Meteor.logout();
    return FlowRouter.go('/login');
  }

  notdashboard() {
    if (FlowRouter.getRouteName() === "Dashboard") {
      return false;
    } else {
      return true;
    }
  }
}

HeaderComponent.register('HeaderComponent');
