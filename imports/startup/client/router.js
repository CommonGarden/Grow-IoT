import { FlowRouter } from 'meteor/kadira:flow-router';
import { mwcLayout } from 'meteor/mwc:layout';


FlowRouter.wait();

document.addEventListener("WebComponentsReady", function() {
  FlowRouter.initialize({});
});


// For hacking on the interesting stuff.
// FlowRouter.route("/:view?", {
//   name:'landing',
//   triggersEnter:[function(c,r){
//     if(!c.params.view)
//       r("/home");
//   }],
//   action:function(params,queryParams){
//     mwcLayout.render("demo-landing",{"main":"main-layout"});
//   }
// });

FlowRouter.route("/",{
  name:"landing",
  action:function(p,q) {
    // console.log('go');
    mwcLayout.render("demo-landing", {"main":"main-layout"});
  },
  triggersEnter:[function(p,q){
    if (Meteor.user()) {
      FlowRouter.go('after-login');
    }
    else if(Meteor.loggingIn()){
      Tracker.autorun(function(c){
        if(Meteor.user()){

          FlowRouter.go('after-login');
        }
      }); 
    }
    else {
      FlowRouter.go('accounts');
    }

  }]
});

var autherized = FlowRouter.group({
  name: "autherized",
  prefix: "/autherized",
  triggersEnter: [function(context, redirect){
    if (!(Meteor.user() || Meteor.loggingIn())) {
      redirect('/accounts');
    }
  }]
});

autherized.route("/:view?", {
  name: "after-login",
  triggersEnter:[function(c,r){
    if(!c.params.view){
      var path = FlowRouter.path("after-login",{view:'home'});
      r(path);
    }
  }],
  action: function(p, q){
    mwcLayout.render("after-login",{"main":"main-layout"});
  }
});

FlowRouter.route("/accounts/:view?", {
  name:"accounts",
  triggersEnter:[function(c,r){
    if(!c.params.view){
      var path = FlowRouter.path("accounts",{view:'sign-in'});
      r(path);
    }
  }],
  action: function(p, q) {
    mwcLayout.render("accounts", {
      main: "accounts-element"
    });
  }
});

// autherized.route('/thing/:uuid', {
//   name: 'DisplayComponent',
//   action(params, queryParams) {
//     mwcLayout.render("accounts", {
//       main: "accounts-element"
//     });
//   }
// });

// autherized.route('/things/', {
//   name: 'AllDevicesComponent',
//   action(params, queryParams) {
//     mwcLayout.render("accounts", {
//       main: "accounts-element"
//     });
//   }
// });

// autherized.route("/:view?", {
//   name:'landing',
//   triggersEnter:[function(c,r){
//     if(!c.params.view)
//       r("/home");
//   }],
//   action:function(params,queryParams){
//     mwcLayout.render("demo-landing",{"main":"main-layout"});
//   }
// });

// autherized.route('/notifications', {
//   name: 'NotificationsHistory',
//   action(params, queryParams) {
//     mwcLayout.render("accounts", {
//       main: "accounts-element"
//     });
//   }
// });

