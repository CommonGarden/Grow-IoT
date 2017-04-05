import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { Charts, ChartContainer, ChartRow, YAxis, LineChart } from "react-timeseries-charts";
import { TimeSeries, TimeRange, Event } from "pondjs";
import _ from 'underscore';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import PowerIcon from 'material-ui/svg-icons/action/power-settings-new';
import ScheduleIcon from 'material-ui/svg-icons/action/schedule';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import CameraIcon from 'material-ui/svg-icons/image/camera-alt';
import Divider from 'material-ui/Divider';
import FileUpload from '../app/components/images/FileUpload';

class ImageComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (<FileUpload />);
  }
}

export default ImageComponent;

// TODO: DON'T MAKE THINGS SUCH A MASSIVE HACK

// ImageComponent.propTypes = {
//   images: React.PropTypes.array,
// }

// // Get images!
// export default ImageComponentContainer = createContainer(({ thing }) => {
//   const imagesHandle = Meteor.subscribe('Thing.events', thing.uuid);
  
//   const loading = [ imagesHandle ].every(
//     (h) => {
//       return h.ready();
//     }
//   );

//   const images = Images.find({}).fetch();

//   return {
// 	images,
//     loading
//   }
// }, GrowHub);
