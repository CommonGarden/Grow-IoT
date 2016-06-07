class NotFoundComponent extends CommonComponent {}

NotFoundComponent.register('NotFoundComponent');

FlowRouter.notFound = {
  action() {
    return BlazeLayout.render('MainLayoutComponent',
      {main: 'NotFoundComponent'});
  }
};
