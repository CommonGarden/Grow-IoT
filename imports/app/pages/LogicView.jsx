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
import Chip from 'material-ui/Chip';
import FontIcon from 'material-ui/FontIcon';
import SvgIconFace from 'material-ui/svg-icons/action/face';
import {blue300, indigo900} from 'material-ui/styles/colors';




class LogicView extends Component {
  state = {
    loading: false,
  }

  componentWillMount() {
  }

  renderThings() {
    const things = this.props.Things;
    if (things && things.length) {
      return (
        <Grid>
          <Row className="layout horizontal center-justified">
            {
              things.map((v, k) => {
                console.log(v);
                return (
                  <Chip
                    key={k}
                  >
                    {v.uuid}
                  </Chip>
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

LogicView.PropTypes = {
  Things: PropTypes.array,
}

export default LogicViewContainer= createContainer(({ user, thingsChanged }) => {
  const things = Things.find().fetch();
  const h = Meteor.subscribe('Things.list');

  return {
    Things: things,
    thingsChanged,
    loading: h.ready(),
  }
}, LogicView);
