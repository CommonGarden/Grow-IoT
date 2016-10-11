class growMainView {
  attached(){
    //this.async(()=>{
      //this.resetLayout();
    //},100);
  }
  beforeRegister(){
    this.is = "grow-main-view";
    this.properties = {
      selected_1_1:{
        type:Number,
        value:0
      }

    };
  }
  get behaviors(){
    return [
      mwcMixin,
    ];
  }
  resetLayout(){
    this.$.headerPanel.resetLayout();
  }
}
Polymer(growMainView);
