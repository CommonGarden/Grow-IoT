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
    },
    toastElem:{
      type:Object,
      value:function(){
        return document.querySelector("#global_toast");
      }
    }
  },

  toast: function(text){
    var toast = this.toastElem;
    toast.toast(text);
  },

  signIn: function(e){
    e.preventDefault();
    var self = this;
    if(!Meteor.status().connected){
      self.toast({text:"Logging Out...",duration:-1});//infinite toast
    }

    Meteor.loginWithPassword(this.email, this.password, function(e){
      if(e){
        self.toast({text:e.reason,duration:3000});
      }
      else{
        self.toast({text:"successful",duration:3000});
        FlowRouter.go('/');
      }
    });
  },

  signUp:function(e){
    e.preventDefault();
    var self = this;
    Accounts.createUser({
      email: this.email,
      password: this.password
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

  _visibility: function(e) {
    const icon = e.target;
    const input = Polymer.dom(icon).parentNode;
    switch (input.type) {
      case 'password':
        icon.icon = 'visibility';
      input.type = 'text';
      break;

      case 'text':
        icon.icon = 'visibility-off';
      input.type = 'password';
      break;
    }
  },

  changeRoute:function(newValue,oldValue){
    FlowRouter.setParams({'view':newValue}); 
  }
})
