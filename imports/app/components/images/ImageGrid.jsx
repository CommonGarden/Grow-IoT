import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import {Meteor} from 'meteor/meteor';
import {_} from 'meteor/underscore';
import {GridList, GridTile} from 'material-ui/GridList';
import CircularProgress from 'material-ui/CircularProgress';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import FileDownload from 'material-ui/svg-icons/file/file-download';
import RaisedButton from 'material-ui/RaisedButton';

class ImageGrid extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    limit: 10,
    skip: 0,
  }

  handleLoadMore = () => {
    const skip = this.state.skip + 10;
    const limit = this.state.limit;
    Meteor.subscribe('Images.all', limit, skip);
    this.setState({ skip });
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
                let link = Images.findOne({_id: aFile._id}).link();  //The "view/download" link

                // Send out components that show details of each file
                return <span key={key}>
                  <GridTile
                    title={aFile.name}
                    subtitle={<span>Size: {aFile.size}</span>}
                    actionIcon={
                      <IconButton onTouchTap={this.removeFile}
                                  data-id={aFile._id}
                                  tooltip="Delete Picture"
                                  tooltipPosition="top-left">
                        <DeleteIcon color="white" />
                      </IconButton>
                    }
                  >
                    <img src={link} style={styles.img} />
                  </GridTile>
                </span>
              })
            }
          </GridList>
          <div style={{padding: 10}}>
            <RaisedButton label="Load More" primary={true} onTouchTap={this.handleLoadMore}/>
          </div>
        </div>
      )
    }
    else {
      return <div><CircularProgress size={80} thickness={5} /></div>
    }
  }
}

ImageGrid.propTypes = {
  images: PropTypes.array,
  ready: PropTypes.bool,
}

// // Get images!
export default ImageGridContainer = createContainer(({ thing }) => {
  const imagesHandle = Meteor.subscribe('Images.all');
  
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



