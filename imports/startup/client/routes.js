import { FlowRouter } from 'meteor/kadira:flow-router';
import { mwcLayout } from 'meteor/mwc:layout';

FlowRouter.wait();

document.addEventListener("WebComponentsReady", function() {
  FlowRouter.initialize({
  });
});

FlowRouter.route("/:view?", {
  name:'landing',
  triggersEnter:[function(c,r){
    if(!c.params.view)
      r("/home");
  }],
  action:function(params,queryParams){
    mwcLayout.render("demo-landing",{"main":"main-layout"});
  }
});

FlowRouter.route("/edit", {
  name:'edit',
  action:function(params,queryParams){
    mwcLayout.render('demo-edit',{"main":"demo-route2","header":"demo-header"});
    console.log('reached /edit');
  }
});


// // Routes in this group are for logged in users. Unauthenticated users
// // will be redirected to login / signup.

// // // From: https://medium.com/@satyavh/using-flow-router-for-authentication-ba7bb2644f42#.vty74pkpy
// let loggedIn = FlowRouter.group({
//  triggersEnter: [ function() {
//    // if (!Meteor.loggingIn() && !Meteor.userId()) {
//    //   let route = FlowRouter.current();
//    //   if (route.route.name !== 'login') {
//    //     Session.set('redirectAfterLogin', route.path);
//    //   }
//    //   return FlowRouter.go('/login');
//    // }
//  }
//  ]
// });

// loggedIn.route('/account', {
//   name: 'AccountPageComponent',
//   action(params, queryParams) {
//     return BlazeLayout.render('MainLayoutComponent',
//       {main: 'AccountPageComponent'});
//   }
// });

// loggedIn.route('/thing/:uuid', {
//   name: 'DisplayComponent',
//   action(params, queryParams) {
//     return BlazeLayout.render('MainLayoutComponent',
//       {main: 'DisplayComponent'});
//   }
// });

// loggedIn.route('/things/', {
//   name: 'AllDevicesComponent',
//   action(params, queryParams) {
//     return BlazeLayout.render('MainLayoutComponent',
//       {main: 'AllDevicesComponent'});
//   }
// });

// loggedIn.route('/', {
//   name: 'Dashboard',
//   action(params, queryParams) {
//     return BlazeLayout.render('MainLayoutComponent',
//       {main: 'Dashboard'});
//   }
// });

// loggedIn.route('/notifications', {
//   name: 'NotificationsHistory',
//   action(params, queryParams) {
//     return BlazeLayout.render('MainLayoutComponent',
//       {main: 'NotificationsHistory'});
//   }
// });
