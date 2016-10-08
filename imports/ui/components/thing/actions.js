Polymer({
  is:"thing-actions",
  properties:{
    name:{
      type:String,
      value:"Actions"
    },
    actions: Object
  },
  tracker: function () {
    this.subscribe('Thing.actions', this.uuid);
    
    // Todo: get only relevant fields.
    this.set('actions', Things.find({uuid: uuid}));
  },
  sendCommand: function(e){
    let type = e.currentTarget.dataset.call;
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
