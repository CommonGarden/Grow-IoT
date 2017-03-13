import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import ThingDisplay from '../components/ThingDisplay.jsx';

class ThingsList extends Component {
  componentWillMount() {
    this.subThings();
  }
  subThings(){
    Meteor.subscribe('Things.list');
  }
  render () {
      return (
      <div className="layout horizontal wrap">
        {
          this.props.Things.map((v, k) => {
            return (
              <ThingDisplay key={k}
                thing={v}
              />
            )
          })
        }
      </div>
    )
  }
}

export default ThingsListContainer= createContainer(({ user }) => {
  return {
    Things: Things.find().fetch(),
  }
}, ThingsList);
