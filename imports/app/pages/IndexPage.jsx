import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';

export default class IndexPage extends Component {
  goToApp() {
    browserHistory.push('/app');
  }
  render () {
    return (
      <div className="layout vertical flex center center-justified">
        <h1> This is the landing page of Grow-IoT </h1>
        <RaisedButton label="Go To App" primary={true} onTouchTap={this.goToApp}/>
      </div>
    )
  }
}

