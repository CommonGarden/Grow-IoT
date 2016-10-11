class thingDisplay {
  // attached(){
  //   //this.async(()=>{
  //     //this.resetLayout();
  //   //},100);
  // }
  beforeRegister(){
    this.is = "thing-display";
    this.properties = {
      uuid: String,
      thing: {
        type: Object
      }
    };
  }
  get behaviors(){
    return [
      mwcMixin,
    ];
  }
  // resetLayout(){
  //   this.$.headerPanel.resetLayout();
  // }
  tracker() {
    // subscribe to things list
    let uuid = this.get('uuid');
    this.subscribe('Things.one', uuid);
    let thing = Things.find({}).fetch();
    this.set('thing', thing);
  } 
}
Polymer(thingDisplay);

