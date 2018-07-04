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
import { Charts, ChartContainer, ChartRow, YAxis, LineChart, Resizable } from "react-timeseries-charts";
import { TimeSeries, TimeRange, Event } from "pondjs";
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  CardTitle,
  CardText
} from 'material-ui/Card';
import AppBar from 'material-ui/AppBar';
import SettingsIcon from 'material-ui/svg-icons/action/settings';

class ThingDetail extends Component {
  state = {
    loading: false,
  }

  back = () => {
    this.props.history.goBack();
  }

  getEvents(type) {
    const e = this.props[`${type}Events`];

    let data = {
      name: type,
      columns: ["time", "value"],
      points: []
    };
    _.each(e, (value, key, list) => {
      data.points.unshift([value.event.timestamp.getTime(), value.event.message])
    });
    if (data.points[0]) return new TimeSeries(data);
  }

  getEventValue(type) {
    const e = this.props[`${type}Events`];
    if (e) {
      let value = e[0] ? Number(e[0].event.message).toFixed(2) : 'NA';
      if (!isNaN(value)){
        return value;
      } else {
        return e[0] ? e[0].event.message: 'NA';
      }
    }
  }

  render () {
    const styles = {
      circProg: {
        marginTop: 45
      }
    };

    const thing = this.props.thing;
    const series = this.getEvents(this.props.type);
    const sensors = thing ? thing.properties.types.sensors: null;

    // Get the sensor info
    let typeInfo;
    if (sensors) {
      for(var i = 0; i < sensors.length; i++) {
        if (sensors[i].type === this.props.type) {
          typeInfo = sensors[i];
          break;
        }
      }
    }

    return (
      this.props.ready ? <div>
        <AppBar
          title={thing.name}
          titleStyle={{
            textAlign: 'center',
            fontSize: 16,
            color: 'black'
          }}
          style={{
            color: 'black',
            backgroundColor: 'transparent',
            boxShadow: 'none'
          }}
          iconElementLeft={
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
                           color: 'black',
                           fill: 'black'
                         }}>
              <LeftChevron />
            </IconButton>
          }
        />
        <div style={{textAlign:'center'}}>
          <h2>{typeInfo? typeInfo.title:this.props.type}</h2>
          <h1>{this.getEventValue(this.props.type)}{typeInfo.unit ? <i className={typeInfo.unit}></i>:null}</h1>
        </div>
        <Resizable>
          <ChartContainer timeRange={series.range()} width={400}>
            <ChartRow height="350">
              <YAxis
                id="light"
                min={series.min()} max={series.max()}
                width="60" />
              <Charts>
                <LineChart axis="light" series={series} />
              </Charts>
            </ChartRow>
          </ChartContainer>
        </Resizable>
      </div>:<CircularProgress size={80} thickness={5} style={styles.circProg} />
    )
  }
}

ThingDetail.propTypes = {
  thing: PropTypes.object,
  ready: PropTypes.bool,
  type: PropTypes.string
}

export default ThingDetailContainer= createContainer(({ user, match }) => {
  let thingHandle = Meteor.subscribe('Things.one', match.params.uuid);
  let eventsHandle = Meteor.subscribe('Thing.events', match.params.uuid);
  let container = {};

  container.type = match.params.type;
  container.thing = Things.findOne({ uuid: match.params.uuid });
  if (container.thing) {
    container[`${match.params.type}Events`]= Events.find({'event.type': match.params.type, 'thing._id': container.thing._id}, {
      sort: { insertedAt: -1 }
    }).fetch();
  }

  container.ready = [ thingHandle, eventsHandle ].every(
    (h) => {
      return h.ready();
    }
  );

  return container;
}, ThingDetail);
