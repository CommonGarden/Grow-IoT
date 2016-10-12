Polymer({
  is:"thing-actions",
  properties:{
    name:{
      type:String,
      value:"Actions"
    },
    uuid: String,
    actions: Array
  },

  tracker: function () {
    this.subscribe('Thing.actions', this.uuid);

    let actions = Things.findOne({
      uuid: this.uuid
    },
    {
      fields: {
        _id: 1,
        actions: 1
      }
    });

    // Todo: get only relevant fields.
    this.set('actions', actions);
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
