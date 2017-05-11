import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import CameraIcon from 'material-ui/svg-icons/image/camera-alt';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import PropTypes from 'prop-types';
import BaseThing from './BaseThing';

class CameraComponent extends BaseThing {
  constructor(props) {
    super(props);
  }

  handleScheduleChange = (event, newValue) => {
    this.sendCommand('stop');
    let key = event.target.dataset.key;
    this.setProperty(key, newValue);
    this.sendCommand('start');
  }

  takePicture = () => {
    this.sendCommand('picture');
  }

  render() {
    const styles = {
      main: {
        width: '100%',
        height: '100%',
      },
      img: {
        maxHeight: '100%',
        width: '100%',
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
        <div style={styles.main}>
            <img src={link} style={styles.img} />
            <IconButton onTouchTap={this.takePicture}
                        tooltip="Take picture"
                        style={styles.button}
                        iconStyle={styles.white} ><CameraIcon /></IconButton>
            <TextField
              hintText="Milliseconds between pictures"
              floatingLabelText="Schedule photo"
              defaultValue="60000"
              data-key="interval"
              onChange={this.handleScheduleChange}
              inputStyle={styles.white}
              floatingLabelStyle={styles.white}
              hintStyle={styles.white}
              style={styles.scheduleField}
            />
        </div>
      )
    }
    else return (
      <div style={styles.img}>No Images
        <IconButton onTouchTap={this.takePicture}
                    tooltip="Take picture">
          <CameraIcon />
        </IconButton>
      </div>
    )
  }
}

CameraComponent.propTypes = {
  image: PropTypes.object,
  ready: PropTypes.bool,
}

// Get images!
export default CameraComponentContainer = createContainer(({ thing }) => {
  const imagesHandle = Meteor.subscribe('Thing.images', thing.uuid, 1);

  const ready = [ imagesHandle ].every(
    (h) => {
      return h.ready();
    }
  );

  const image = Images.findOne({
    'meta.thing': thing._id,
  }, {
    'sort': {
      'meta.insertedAt': -1
    },
  });

  return {
    image,
    ready
  }
}, CameraComponent);



