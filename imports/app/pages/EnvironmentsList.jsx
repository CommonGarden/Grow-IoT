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
import AppBarComponent from '../components/AppBar.jsx';

class EnvironmentsList extends Component {
  state = {
    loading: false,
  }

  componentWillMount() {
  }

  renderEnvironments() {
    const environments = this.props.Environments;

    if (environments && environments.length) {
      return (
        <div>
        <AppBarComponent {...this.props} />
        <Grid>
          <Row className="layout horizontal center-justified">
            {
              environments.map((v, k) => {
                return (
                  <p key={k}>{v.uuid}</p>
                )
              }
              )
            }
          </Row>
        </Grid>
        </div>
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
      this.state.loading ? <CircularProgress size={80} thickness={5} style={styles.circProg} /> : this.renderEnvironments()
    )
  }
}

EnvironmentsList.propTypes = {
  Environments: PropTypes.array,
}

export default EnvironmentsListContainer= createContainer(({ user, thingsChanged }) => {
  const h = Meteor.subscribe('Environments.list');
  const environments = Environments.find().fetch();

  return {
    Environments: environments,
    thingsChanged,
    loading: h.ready(),
  }
}, EnvironmentsList);
