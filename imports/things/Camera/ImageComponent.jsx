import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import ImageUpload from '../../app/components/images/ImageUpload';
import ImageGrid from '../../app/components/images/ImageGrid';
import ImageOne from '../../app/components/images/ImageOne';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

// TODO: implement show more...

class ImageList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const cardStyle = {
      margin: '20px',
    }
    return (
      <Card style={cardStyle}>
        <CardText>
          <ImageGrid />
        </CardText>
        <CardActions>
          {this.props.actions}
        </CardActions>
      </Card>
    );
  }
}

export default ImageList;
