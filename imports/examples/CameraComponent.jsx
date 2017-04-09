import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import ImageOne from '../app/components/images/ImageOne';


class CameraComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
      	<ImageOne />
      </div>
    );
  }
}

export default CameraComponent;
