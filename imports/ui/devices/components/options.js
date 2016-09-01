import later from 'meteor-later';

Device.OptionsComponent = class OptionsComponent extends Device.DisplayComponent {
  onCreated() {
    super.onCreated();
  }

  events() {
    return super.events().concat({
      ['click .update-opts'](e) {
        e.preventDefault();
        let id = e.currentTarget.dataset.id;
        let type = e.currentTarget.dataset.type;
        let value = $('#' + type + '-' + id).val();

        let options = {
          property: type,
          key: id,
          value: value
        };
        return Meteor.call('Device.sendCommand',
          this.currentDeviceUuid(),
          'setProperty',
          options,
          (error, documentId) => {
            if (error) {
              console.error("New deviceerror", error);
              return alert(`New deviceerror: ${error.reason || error}`);
            }

            Bert.alert('Property updated', 'success', 'growl-top-right');
          }
        );
      },
      ['click .schedule'](e) {
        e.preventDefault();
        let id = e.currentTarget.dataset.id;
        let newSchedule = $('[name="schedule-' + id + '"]').val();
        
        // Todo: validate new schedule
        try {
         later.parse.text(newSchedule);
        } catch (error) {
          console.log(error);
        }

        let options = {
          property: 'schedule',
          key: id,
          value: newSchedule
        };
        return Meteor.call('Device.sendCommand',
          this.currentDeviceUuid(),
          'setProperty',
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
}

Device.OptionsComponent.register('OptionsComponent');
