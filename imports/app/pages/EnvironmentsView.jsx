import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import CircularProgress from 'material-ui/CircularProgress';
import { Grid, Row, Col } from 'react-flexbox-grid';
import PropTypes from 'prop-types';
import EnvironmentDisplay from '../components/EnvironmentDisplay.jsx';
import EmptyState from '../components/EmptyState.jsx';


class EnvironmentView extends Component {
  state = {
    loading: false,
  }

  componentWillMount() {
    this.subEnvironments();
  }

  subEnvironments(){
    this.setState({ loading: true });
    Meteor.subscribe('Environments.one', this.props.match.params.uuid, (h) => {
      this.setState({ loading: false });
    });
  }

  renderEnvironments() {
    const thing = this.props.Environment;
    if (thing) {
      return (
          <div className="layout horizontal center-justified">
            <EnvironmentDisplay thing={thing}/>
          </div>
      );
    } else {
      return (
        <EmptyState>
          <div
            style={{fontSize: 15}}>
            Environment with uuid <br/> {this.props.match.params.uuid} <br/> does not exist.
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
      this.state.loading ? <CircularProgress size={80} thickness={5} style={styles.circProg} /> : this.renderEnvironments()
    )
  }
}

EnvironmentView.PropTypes = {
  Environment: PropTypes.object,
}

export default EnvironmentViewContainer= createContainer(({ user, match }) => {
  const thing = Environments.findOne({ uuid: match.params.uuid });
  return {
    Environment: thing,
  }
}, EnvironmentView);
