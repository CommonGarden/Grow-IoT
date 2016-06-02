class Title extends UIComponent {
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
}

Title.register('Title');
