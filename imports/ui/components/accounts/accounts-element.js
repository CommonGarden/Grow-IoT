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

  toast: function(text){
    var toast = this.$.polymer_toast;
    toast.text = text;
    toast.toggle();
  },

  signIn: function(e){
    e.preventDefault();
    var self = this;
    Meteor.loginWithPassword(this.email, this.password, function(e){
      if(e){
        self.toast(e.reason);
      }
      else{
        self.toast("successful");
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

  _visibility: function() {
    switch (this.$.password.type) {
      case 'password':
        this.$.password.querySelector('iron-icon[icon^=visibility]').icon = 'visibility';
        this.$.password.type = 'text';
        break;

      case 'text':
        this.$.password.querySelector('iron-icon[icon^=visibility]').icon = 'visibility-off';
        this.$.password.type = 'password';
        break;
    }
  },

  changeRoute:function(newValue,oldValue){
    FlowRouter.setParams({'view':newValue}); 
  }
})
