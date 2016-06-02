class BackButton extends UIComponent {
  onCreated() {
    return super.onCreated();
  }

  dashboard() {
    if (FlowRouter.getRouteName() === "Dashboard") {
      return true;
    } else {
      return false;
    }
  }

  events() {
    return super.events().concat({
      ['click .back-button'](event) {
        event.preventDefault();
        return history.back();
      }
    });
  }
}

BackButton.register('BackButton');
