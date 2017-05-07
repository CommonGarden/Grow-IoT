import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';
import { Grid, Row, Col } from 'react-flexbox-grid';
import PropTypes from 'prop-types';
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
      return (
        <Grid style={{width: '100%'}}>
          <Row className="layout horizontal center-justified">
            {
              things.map((v, k) => {
                return (
                  <ThingDisplay thing={v} key={k}/>
                )
              }
              )
            }
          </Row>
        </Grid> 
      );
    } else {
      return (
        <EmptyState />
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
      this.state.loading ? <CircularProgress size={80} thickness={5} style={styles.circProg} /> : this.renderThings()
    )
  }
}

ThingsList.PropTypes = {
  Things: PropTypes.array,
}

export default ThingsListContainer= createContainer(({ user, thingsChanged }) => {
  const things = Things.find().fetch();
  return {
    Things: things,
    thingsChanged,
  }
}, ThingsList);
