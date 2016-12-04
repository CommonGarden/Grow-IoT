import { AppState } from '../../state';
import { setToast, setError, setRoute } from '../../actions';

class growDashboard {

  beforeRegister() {
    this.is="grow-dashboard";
    this.properties={
      showSidebar:{
        type:Boolean,
        value:false
      },
      selected:{
        type:Number
      },
      smScreen:Boolean,
      narrow:Boolean,
      mwcRoute:{
        type:Object,
        name:"dashboard",
        params:{"view":"home"}
      }
    };
    this.actions = { setToast, setError };
  }

  attached(){
    this.async(()=> {

      this.selected = 0;
    },100);
  }

  get behaviors() {
    return [
      mwcMixin, AppState
    ];
  }

  closeMenu() {
    return this.smScreen ? this.$.drawerPanel.closeDrawer() : this.showSidebar = false;
  }

  computeForceNarrow(e,n) {
    return e||!n;
  }

  openMenu() {
    return this.smScreen ? this.$.drawerPanel.openDrawer() : this.showSidebar = true;
  }

  new() {
    const self = this;
    Meteor.call('Thing.new',
      (error, document) => {
        if (error) {
          self.dispatch('setError', error, {
            file: 'dashboard',
            method: 'new',
          });
        } else {
          self.dispatch('setToast', 'Successful.');
        }
      }
    );
  }

  toggleMenu() {
    this.$.drawerPanel.togglePanel();
  }

  __signOut() {
    const self = this;
    if(!Meteor.status().connected){
      self.dispatch(setToast.bind(this, ['Loggin Out...', -1]));//infinite toast
    }

    Meteor.logout((e, r) => {
      self.dispatch(setToast.bind(self, 'successful', 2000));
      self.dispatch(setRoute.bind(self, { path: '/' }));
    });
  }
}

Polymer(growDashboard);
