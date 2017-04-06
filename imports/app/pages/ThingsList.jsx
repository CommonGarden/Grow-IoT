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

  componentWillReceiveProps(nextProps) {
    this.props.thingsChanged(nextProps.Things);
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
            Click the + button to create a new thing.
          </div>
        </EmptyState>
      );
    }
  }

  render () {
    const styles = {
      circProg: {
        marginTop: 45
      }
    };
    
    return (
      <div className="layout horizontal wrap">
        {
          this.state.loading ? <CircularProgress size={80} thickness={5} style={styles.circProg} /> : this.renderThings()
        }
      </div>
    )
  }
}

ThingsList.PropTypes = {
  Things: React.PropTypes.array,
}

export default ThingsListContainer= createContainer(({ user, thingsChanged }) => {
  const things = Things.find().fetch();
  return {
    Things: things,
    thingsChanged,
  }
}, ThingsList);
