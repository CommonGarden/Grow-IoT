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

class ThingsList extends Component {
  state = {
    loading: false,
  }

  componentWillMount() {
  }

  renderThings() {
    const things = this.props.Things;
    if (things && things.length) {
      return (
        <div>
        <Grid>
          <Row className="layout horizontal center-justified">
            {
              things.map((v, k) => {
                return (
                  <ThingDisplay {...this.props}  thing={v} key={k}/>
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
      this.state.loading ? <CircularPrgress size={80} thickness={5} style={styles.circProg} /> : <div>
        <AppBarComponent {...this.props} />
        {this.renderThings()}
      </div>

    )
  }
}

ThingsList.propTypes = {
  Things: PropTypes.array,
}

export default ThingsListContainer= createContainer(({ user, thingsChanged }) => {
  const things = Things.find().fetch();
  const h = Meteor.subscribe('Things.list');

  return {
    Things: things,
    thingsChanged,
    loading: h.ready(),
  }
}, ThingsList);
