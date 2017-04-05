import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import {_} from 'meteor/underscore';
import {GridList, GridTile} from 'material-ui/GridList';
import CircularProgress from 'material-ui/CircularProgress';


class ImageGrid extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const styles = {
      root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
      },
      gridList: {
        width: 500,
        height: 450,
        overflowY: 'auto',
      },
      img: {
        maxWidth: '100%',
      }
    };

    if (this.props.ready) {       
      return (
        <div style={styles.root}>
          <GridList
            cellHeight={180}
            style={styles.gridList}
          >
            {
              this.props.images.map((aFile, key) => {
                // console.log('A file: ', aFile.link(), aFile.get('name'));

                let link = Images.findOne({_id: aFile._id}).link();  //The "view/download" link

                // Send out components that show details of each file
                return <span key={key}>
                  <GridTile
                    title={aFile.name}
                    subtitle={<span>Size: {aFile.size}</span>}
                  >
                    <img src={link} style={styles.img} />
                  </GridTile>
                </span>
              })
            }
          </GridList>
        </div>
      )
    }
    else {
      return <div><CircularProgress size={80} thickness={5} /></div>
    }
  }
}

ImageGrid.propTypes = {
  images: React.PropTypes.array,
  ready: React.PropTypes.bool,
}

// // Get images!
export default ImageGridContainer = createContainer(({ thing }) => {
  const imagesHandle = Meteor.subscribe('files.images.all');
  
  const ready = [ imagesHandle ].every(
    (h) => {
      return h.ready();
    }
  );

  const images = Images.find({}).fetch();

  return {
    images,
    ready
  }
}, ImageGrid);



