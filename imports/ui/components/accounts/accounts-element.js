import { AppState } from '../../state';
import { setToast, setError, setRoute } from '../../actions';

Polymer({
  is:'accounts-element',

  behaviors:[mwcMixin, AppState],

  properties: {
    route: Object,
  },

  toast: function(text){
    var toast = this.toastElem;
    toast.toast(text);
  },

  signIn: function(e){
    e.preventDefault();
    var self = this;
    if(!Meteor.status().connected){
      // return self.dispatch(setToast.bind(this, ['Connecting to server...', -1]));//infinite toast
    }

    Meteor.loginWithPassword(this.email, this.password, function(e){
      if (e) {
        return self.dispatch(setToast.bind(self, [e.reason, 3000]));
      }
      self.dispatch(setToast.bind(self, 'successful', 2000));
      self.dispatch(setRoute.bind(self, { path: '/' }));
    });
  },

  signUp:function(e){
    e.preventDefault();
    var self = this;
    Accounts.createUser({
      email: this.email,
      password: this.password
    },function(e){
      if(e) {
        return self.dispatch(setToast.bind(self, [e.reason, 3000]));
      }
      self.dispatch(setToast.bind(self, 'successful', 2000));
      self.dispatch(setRoute.bind(self, { path: '/' }));
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
});
