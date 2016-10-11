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
      },
      things: {
        type: Array
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
  tracker() {
    // subscribe to things list
    this.subscribe('Things.list');
    let things = Things.find({}).fetch();
    this.set('things', things);
  } 
}
Polymer(growMainView);
