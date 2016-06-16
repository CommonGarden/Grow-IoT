import later from 'meteor-later';

Device.Scheduler = class Scheduler extends Device.ActionComponent {
  onCreated() {
    super.onCreated();

    return this.type = Template.currentData().type;
  }

  events() {
    return super.events().concat({
      ['click .schedule'](e) {
        e.preventDefault();
        let actionID = e.currentTarget.dataset.id;
        let newSchedule = $('[name="schedule-' + actionID + '"]').val();
        
        // Todo: validate new schedule
        try {
         later.parse.text(newSchedule);
        } catch (error) {
          console.log(error);
        }

        let options = {
          actionKey: actionID,
          newValue: newSchedule
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

            Bert.alert('Schedule updated', 'success', 'growl-top-right');
          }
        );
      }
    });
  }
};

Device.Scheduler.register('Device.Scheduler');
