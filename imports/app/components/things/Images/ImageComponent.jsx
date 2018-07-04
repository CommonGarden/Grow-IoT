import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import ImageUpload from '../../images/ImageUpload';
import ImageGrid from '../../images/ImageGrid';
import ImageOne from '../../images/ImageOne';
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
