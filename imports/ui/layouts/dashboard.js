class growDashboard {
  beforeRegister(){
    this.is="grow-dashboard";
    this.properties={
      showSidebar:{
        type:Boolean,
        value:true
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

}
Polymer(growDashboard);
