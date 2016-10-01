import { FlowRouter } from 'meteor/kadira:flow-router';
// import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { AccountsTemplates } from 'meteor/useraccounts:core';
import { mwcLayout } from 'meteor/mwc:layout';

FlowRouter.wait();

document.addEventListener("WebComponentsReady", function() {
  FlowRouter.initialize({
  });
});

FlowRouter.route("/", {
  name:'landing',
  action:function(params,queryParams){
    mwcLayout.render('demo-layout',{"main":"test-element"});
    console.log('reached /');
  }
});
FlowRouter.route("/edit", {
  name:'edit',
  action:function(params,queryParams){
    mwcLayout.render('demo-edit',{"main":"demo-route2","header":"demo-header"});
    console.log('reached /edit');
  }
});

// // See https://atmospherejs.com/useraccounts/flow-routing
// AccountsTemplates.configureRoute('signIn', {
//   layoutType: 'blaze',
//   name: 'signin',
//   path: '/login',
//   template: 'LoginComponent',
//   layoutTemplate: 'MainLayoutComponent',
//   contentRegion: 'main'
// });

// AccountsTemplates.configureRoute('signUp', {
//   layoutType: 'blaze',
//   name: 'signup',
//   path: '/register',
//   template: 'LoginComponent',
//   layoutTemplate: 'MainLayoutComponent',
//   contentRegion: 'main'
// });

// AccountsTemplates.configureRoute('forgotPwd', {
//   layoutType: 'blaze',
//   name: 'forgotpwd',
//   path: '/reset-password',
//   template: 'LoginComponent',
//   layoutTemplate: 'MainLayoutComponent',
//   contentRegion: 'main'
// });

// AccountsTemplates.configureRoute('changePwd', {
//   layoutType: 'blaze',
//   name: 'changePwd',
//   path: '/account',
//   template: 'AccountPageComponent',
//   layoutTemplate: 'MainLayoutComponent',
//   contentRegion: 'main'
// });

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
