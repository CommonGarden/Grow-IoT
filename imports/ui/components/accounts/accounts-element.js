Polymer({
  is:"accounts-element",
  behaviors:[mwcMixin],
  getMeteorData:function(){
    this.selected = FlowRouter.getParam('route') || "sign-in";
  },
  properties:{
    selected:{
      type:String,
      value:"sign-in",
      observer:"changeRoute"
    }

  },
  toast:function(text){
    var toast = this.$.polymer_toast;
    toast.text = text;
    toast.toggle();
  },
  signIn:function(e){
    e.preventDefault();
    var email = e.detail.email;
    var password = e.detail.password;
    var self = this;
    console.log(e);
    Meteor.loginWithPassword(email, password,function(e){
      if(e){
        self.toast(e.reason);
      }
      else{

        self.toast("successful");
        FlowRouter.go('/');
      }
    });
  },

  _signIn:function(){
    this.$.signIn.submit();

  },
  signUp:function(e){
    e.preventDefault();
    var email = e.detail.email;
    var password = e.detail.password;
    var self = this;
    Accounts.createUser({
      email: email,
      password: password
    },function(e){
      if(e){
        self.toast(e.reason);
      }
      else{

        self.toast("successful");
        FlowRouter.go('/');
      }
    });
  },
  _signUp:function(){
    this.$.signUp.submit();
  },
  changeRoute:function(newValue,oldValue){
    FlowRouter.setParams({'view':newValue}); 
  }
})
