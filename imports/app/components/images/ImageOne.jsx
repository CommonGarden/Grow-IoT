import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';


class ImageOne extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.ready && this.props.image) {
      'use strict';

      let image = this.props.image;
      let link = Images.findOne({_id: image._id}).link();

      return (
        <div>
          <img src={link} style={{maxWidth: '100%'}} />
        </div>
      )
    }
    else return <div></div>
  }
}

ImageOne.propTypes = {
  image: React.PropTypes.object,
  ready: React.PropTypes.bool,
}

// Get images!
export default ImageOneContainer = createContainer(({ uuid }) => {
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
}, ImageOne);



