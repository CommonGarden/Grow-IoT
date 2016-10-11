class growDashboard {
  beforeRegister(){
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
    };
  }
  attached(){
    this.async(()=>{

      this.selected = 0;
    },100);
  }
  get behaviors(){
    return [mwcMixin];
  }
  get toastElem(){
    return document.querySelector("#global_toast");
  }
  toast(text){
    if(this.toastElem){
      this.toastElem.toast(text);
    }
  }
  closeMenu(){
    return this.smScreen ? this.$.drawerPanel.closeDrawer() : this.showSidebar = false;
  }

  computeForceNarrow(e,n){
    return e||!n;
  }

  openMenu(){
    return this.smScreen ? this.$.drawerPanel.openDrawer() : this.showSidebar = true;
  }
  toggleMenu(){
    this.$.drawerPanel.togglePanel();
  }
  __signOut(){
    const self = this;
    if(!Meteor.status().connected){
      self.toast({text:"Logging Out...",duration:-1});//infinite toast
    }
    Meteor.logout((e,r)=>{
      FlowRouter.go('/');
      self.toast({text:"successfull",duration:3000});
    });
  }

}
Polymer(growDashboard);
