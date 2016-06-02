class NotFoundComponent extends UIComponent {}

NotFoundComponent.register('NotFoundComponent');

FlowRouter.notFound = {
  action() {
    return BlazeLayout.render('MainLayoutComponent',
      {main: 'NotFoundComponent'});
  }
};
