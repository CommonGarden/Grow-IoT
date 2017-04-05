import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import {_} from 'meteor/underscore';
import {GridList, GridTile} from 'material-ui/GridList';
import CircularProgress from 'material-ui/CircularProgress';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';

class ImageGrid extends Component {
  constructor(props) {
    super(props);
  }

  removeFile (event) {
    let id = event.currentTarget.dataset.id;
    let conf = confirm('Are you sure you want to delete the file?') || false;
    if (conf == true) {
      Meteor.call('Image.delete', id, function (err, res) {
        if (err)
          console.log(err);
      });
    }
  }

  render() {
    const styles = {
      root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
      },
      gridList: {
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
                    actionIcon={<IconButton onTouchTap={this.removeFile} data-id={aFile._id} ><StarBorder color="white" /></IconButton>}
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



