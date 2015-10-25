var usersRoutes = FlowRouter.group({
  prefix: '/users',
  name: 'users',
  triggersEnter: [function(context, redirect) {
    console.log
  }]
});

usersRoutes.route('/', {
  action: function() {
    BlazeLayout.render('componentLayout', {content: 'users'});
  }
})