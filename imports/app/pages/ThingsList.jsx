import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';
import ThingDisplay from '../components/ThingDisplay.jsx';
import EmptyState from '../components/EmptyState.jsx';

class ThingsList extends Component {
  state = {
    loading: false,
  }
  componentWillMount() {
    this.subThings();
  }
  subThings(){
    this.setState({ loading: true });
    Meteor.subscribe('Things.list', (h) => {
      this.setState({ loading: false });
    });
  }
  renderThings() {
    const things = this.props.Things;
    if (things && things.length) {
      return things.map((v, k) => <ThingDisplay key={k} thing={v} />);
    } else {
      return (
        <EmptyState>
          <div className="layout vertical center center-justified"
            style={{height: '100%'}}>
            Empty.
          </div>
        </EmptyState>
      );
    }
  }
  render () {
      return (
      <div className="layout horizontal wrap">
        {
          this.state.loading ? <CircularProgress size={80} thickness={5} /> : this.renderThings()
        }
      </div>
    )
  }
}

export default ThingsListContainer= createContainer(({ user, thingsChanged }) => {
  const things = Things.find().fetch();
  thingsChanged(things);
  return {
    Things: things,
  }
}, ThingsList);
