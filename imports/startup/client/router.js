import { FlowRouter } from 'meteor/kadira:flow-router';
import { mwcLayout } from 'meteor/mwc:layout';

FlowRouter.wait();

document.addEventListener("WebComponentsReady", function() {
  FlowRouter.initialize({});
});

FlowRouter.route("/",{
  name:"landing",
  action:function(p,q) {
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

FlowRouter.route("/accounts/:view?", {
  name:"accounts",
  triggersEnter:[function(c,r){
  	console.log(c);
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
    mwcLayout.render("after-login",{"main":"grow-dashboard"});
  }
});

autherized.route('/thing/:uuid', {
  name: 'DisplayComponent',
  action(params, queryParams) {
    mwcLayout.render("accounts", {
      main: "thing-display"
    });
  }
});
