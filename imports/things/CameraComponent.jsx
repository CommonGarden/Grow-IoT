import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import CameraIcon from 'material-ui/svg-icons/image/camera-alt';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';


class CameraComponent extends Component {
  constructor(props) {
    super(props);
  }

  takePicture () {
    console.log('To do. Send picture command...');
  }

  render() {
    const styles = {
      img: {
        maxWidth: '100%'
      },
      white: {
        color: 'white'
      },
      button: {
        position: 'relative',
        bottom: 80
      },
      scheduleField: {
        bottom: 80,
      }
    };

    if (this.props.ready && this.props.image) {
      'use strict';

      let image = this.props.image;
      let link = Images.findOne({_id: image._id}).link();

      return (
        <div>
            <img src={link} style={styles.img} />
            <IconButton onTouchTap={this.takePicture}
                        tooltip="Take picture"
                        style={styles.button}
                        iconStyle={styles.white} ><CameraIcon /></IconButton>
            <TextField
              hintText="Example: every 2 hours"
              floatingLabelText="Schedule photo"
              defaultValue="every hour"
              onChange={this.handleScheduleChange}
              inputStyle={styles.white}
              floatingLabelStyle={styles.white}
              hintStyle={styles.white}
              style={styles.scheduleField}
            />
        </div>
      )
    }
    else return <div></div>
  }
}

CameraComponent.propTypes = {
  image: React.PropTypes.object,
  ready: React.PropTypes.bool,
}

// Get images!
export default CameraComponentContainer = createContainer(({ uuid }) => {
  const imagesHandle = Meteor.subscribe('Thing.images', uuid, 1);
  
  const ready = [ imagesHandle ].every(
    (h) => {
      return h.ready();
    }
  );

  const image = Images.findOne({});

  return {
    image,
    ready
  }
}, CameraComponent);



