import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import ImageUpload from '../app/components/images/ImageUpload';
import ImageGrid from '../app/components/images/ImageGrid';
import ImageOne from '../app/components/images/ImageOne';


class ImageComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
      	<ImageUpload />
      	<br/>
    	<ImageGrid />
      </div>
    );
  }
}

export default ImageComponent;
