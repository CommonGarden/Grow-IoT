import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import CircularProgress from 'material-ui/CircularProgress';
import { Grid, Row, Col } from 'react-flexbox-grid';
import PropTypes from 'prop-types';
import ThingDisplay from '../components/ThingDisplay.jsx';
import EmptyState from '../components/EmptyState.jsx';
import LeftChevron from 'material-ui/svg-icons/navigation/chevron-left';
import IconButton from 'material-ui/IconButton';

class ThingView extends Component {
  state = {
    loading: false,
  }

  back = () => {
    this.props.history.push('/app/things');
  }

  componentWillMount() {
    this.subThings();
  }

  subThings(){
    this.setState({ loading: true });
    Meteor.subscribe('Things.one', this.props.match.params.uuid, (h) => {
      this.setState({ loading: false });
    });
  }

  renderThings() {
    const thing = this.props.Thing;

    if (thing) {
      return (
        <div className="layout horizontal center-justified">
          <IconButton
            onTouchTap={this.back}
            style={{
              height: 30,
              width: 'auto',
              position: 'absolute',
              left: 10,
              zIndex: 10
            }}
            iconStyle={{
              color: 'white',
            }}>
            <LeftChevron />
          </IconButton>
          <ThingDisplay thing={thing} {...this.props}/>
        </div>
      );
    } else {
      return (
        <EmptyState>
          <div
            style={{fontSize: 15}}>
            Thing with uuid <br/> {this.props.match.params.uuid} <br/> does not exist.
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
      this.state.loading ? <CircularProgress size={80} thickness={5} style={styles.circProg} /> : this.renderThings()
    )
  }
}

ThingView.propTypes = {
  Thing: PropTypes.object,
}

export default ThingViewContainer= createContainer(({ user, match }) => {
  const thing = Things.findOne({ uuid: match.params.uuid });
  return {
    Thing: thing,
  }
}, ThingView);
