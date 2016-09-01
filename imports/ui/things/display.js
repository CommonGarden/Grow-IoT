Thing.DisplayComponent = class DisplayComponent extends CommonComponent {
  onCreated() {
    super.onCreated();

    this.currentThingUuid = new ComputedField(() => {
      return FlowRouter.getParam('uuid');
    });

    this.thing = new ComputedField(() => {
      return Thing.documents.findOne(
        {uuid: this.currentThingUuid()});
    });

    this.autorun(computation => {
      let thingUuid = this.currentThingUuid();
      if (!thingUuid) { return; }

      return this.subscribe('Thing.one', thingUuid);
    });

    return this.autorun(computation => {
      let thing;
      if (!this.subscriptionsReady()) { return; }

      return thing = Thing.documents.findOne(
        {uuid: this.currentThingUuid()}
      , {
        fields: {
          title: 1
        }
      });
    });
  }

  thing() {
    return this.thing();
  }

  // images: ->
  //   Images.files.find({})

  events() {
    return super.events().concat({
      'click .remove': this.remove,
      'click .take-pic': this.takePic
    });
  }

  takePic(event) {
    return MeteorCamera.getPicture([], function(err, data) {
      let newFile = new FS.File(data);

      // HACK: should do this with referencefields.
      // newFile.thing = Thing.documents.findOne
      //   uuid: FlowRouter.getParam 'uuid'

      return Meteor.call('StorageFile.newFile', newFile, function(err, fileObj) {
        if (err) {
          console.log(err);
          return Bert.alert('Image save failed.', 'error', 'growl-top-right');
        } else {
          return Bert.alert('Image saved', 'success', 'growl-top-right');
        }
      });
    });
  }


  notFound() {
    return this.subscriptionsReady() && !this.thing();
  }

  remove() {
    let thing = this.thing();
    if (window.confirm("Are you sure you want to delete this thing?")) {
      return Meteor.call('Thing.remove',
        this.currentThingUuid(),
        (error, documentId) => {
          if (error) {
            console.error("New thingerror", error);
            return alert(`New thingerror: ${error.reason || error}`);
          } else {
            Bert.alert('Thing deleted.', 'success', 'growl-top-right');
            return FlowRouter.go('Dashboard');
          }
        });
    }
  }
};

Thing.DisplayComponent.register('Thing.DisplayComponent');
