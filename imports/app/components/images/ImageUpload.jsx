import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import {_} from 'meteor/underscore';
import {GridList, GridTile} from 'material-ui/GridList';


class ImageUpload extends Component {
  constructor(props) {
    super(props);
  }

  state = {
  	uploading: [],
    progress: 0,
    inProgress: false
  }

  handleUpload = (e) => {
    e.preventDefault();

    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case
      // there was multiple files selected
      var file = e.currentTarget.files[0];

      if (file) {
        let uploadInstance = Images.insert({
          file: file,
          meta: {
            locator: this.props.fileLocator,
            userId: Meteor.userId() // Optional, used to check on server for file tampering
          },
          streams: 'dynamic',
          chunkSize: 'dynamic',
          allowWebWorkers: true // If you see issues with uploads, change this to false
        }, false);

        this.setState({
          uploading: uploadInstance, // Keep track of this instance to use below
          inProgress: true // Show the progress bar now
        });

        // These are the event functions, don't need most of them, it shows where we are in the process
        // uploadInstance.on('start', () => {
        //   console.log('Starting');
        // });

        // uploadInstance.on('end', (error, fileObj) => {
        //   console.log('On end File Object: ', fileObj);
        // });

        uploadInstance.on('uploaded', (error, fileObj) => {
          console.log('uploaded: ', fileObj);

          // Remove the filename from the upload box
          this.refs['fileinput'].value = '';

          // Reset our state for the next file
          this.setState({
            uploading: [],
            progress: 0,
            inProgress: false
          });
        });

        uploadInstance.on('error', (error, fileObj) => {
          console.log('Error during upload: ' + error);
        });

        uploadInstance.on('progress', (progress, fileObj) => {
          console.log('Upload Percentage: ' + progress);
          // Update our progress bar
          this.setState({
            progress: progress
          })
        });

        uploadInstance.start(); // Must manually start the upload
      }
    }
  }

  // This is our progress bar, bootstrap styled
  // Remove this function if not needed
  showUploads() {
    if (!_.isEmpty(this.state.uploading)) {
      return <div>
        {this.state.uploading.file.name}

        <div className="progress progress-bar-default">
          <div style={{width: this.state.progress + '%'}} aria-valuemax="100"
             aria-valuemin="0"
             aria-valuenow={this.state.progress || 0} role="progressbar"
             className="progress-bar">
            <span className="sr-only">{this.state.progress}% Complete (success)</span>
            <span>{this.state.progress}%</span>
          </div>
        </div>
      </div>
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
        width: 500,
        height: 450,
        overflowY: 'auto',
      },
      img: {
        maxWidth: '100%',
      }
    };

    return (
      <div>
        <div className="row">
          <div className="col-md-12">
            <p>Upload New File:</p>
            <input type="file" id="fileinput" disabled={this.state.inProgress} ref="fileinput"
                 onChange={this.handleUpload }/>
          </div>
        </div>

        <div>
          {this.showUploads()}
        </div>
      </div>
    )
  }
}

export default ImageUpload;



