Polymer({
  is:"thing-actions",
  properties:{
    name:{
      type:String,
      value:"Arun Kumar"
    }
  },
  sendCommand: function(e){
    let type = e.currentTarget.dataset.call;
    // OPTIONS NOT WORKING.
    let options = (e.currentTarget.dataset.options != null);
    return Meteor.call('Device.sendCommand',
      this.currentDeviceUuid(),
      type,
      options,
      (error, documentId) => {
        if (error) {
          console.error("New deviceerror", error);
          return alert(`New deviceerror: ${error.reason || error}`);
        }
      }
    );
  }
})
