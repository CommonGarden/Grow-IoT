import later from 'meteor-later';

Device.ActionComponent = class ActionComponent extends Device.DisplayComponent {
  onCreated() {
    super.onCreated();

    return this.type = Template.currentData().type;
  }

  events() {
    return super.events().concat({
      ['click .command'](e) {
        e.preventDefault();
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
      },

      ['click .schedule'](e) {
        e.preventDefault();
        // Todo: get value from the
        console.log($);

        let actionID = e.currentTarget.dataset.id;
        let options = {
          actionKey: actionID,
          newValue: null
        };
        return Meteor.call('Device.sendCommand',
          this.currentDeviceUuid(),
          'updateActionSchedule',
          options,
          (error, documentId) => {
            if (error) {
              console.error("New deviceerror", error);
              return alert(`New deviceerror: ${error.reason || error}`);
            }
          }
        );
      }
    });
  }
};

Device.ActionComponent.register('Device.ActionComponent');
