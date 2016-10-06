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
    console.log(e);
    var email = e.detail.email;
    var password = e.detail.password;
    var self = this;
    Meteor.loginWithPassword(email, password, function(e){
      if(e){
        self.toast(e.reason);
      }
      else{
        self.toast("successful");
        FlowRouter.go('/');
      }
    });
  },

  // _signIn:function(){
  //   this.$.signIn.submit();
  // },

  signUp:function(e){
    e.preventDefault();
    console.log(this.email);
    // let email = this.email;
    // let password = this.password;
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

  // _signUp:function(){
  //   this.$.signUp.submit();
  // },

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
