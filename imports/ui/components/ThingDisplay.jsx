import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import TestDevice from '../../examples/TestDevice.jsx';
import SmartLight from '../../examples/SmartLight.jsx';
import CreateComponent from './CreateComponent.jsx';

export default class ThingDisplay extends Component {
  state = {
    dltOpen: false,
    component: ''
  };
  componentWillMount() {
    this.setComponentType();
  }
  componentDidUpdate(prevProps, prevState) {
    const prevThing = prevProps.thing;
    const currentThing = this.props.thing;
    if(currentThing) {
      if(!prevThing || prevThing.component !== currentThing.component) {
        this.setComponentType();
      }
    }
  }
  setComponentType() {
    const _component = this.props.thing.component || '';
    const component = _component.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); }).capitalizeFirstLetter();
    this.setState({ component });
  }

  deleteThing = () => {
    const thing = this.props.thing;
    this.handleClose();
    Meteor.call('Thing.delete',
      thing.uuid,
      (error, document) => {
        if (error) {
          throw error;
        }
      }
    );
  };

  handleOpen = () => {
    this.setState({ dltOpen: true });
  };

  handleClose = () => {
    this.setState({ dltOpen: false });
  };

  render () {
    const thingStyle = {
      margin: '20px',
    }

    const actions = [
      <FlatButton
        label="No"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Yes"
        primary={true}
        onTouchTap={this.deleteThing}
      />,
    ];

    const r = this.props.thing.registeredAt;
    const unregisteredText = <div>
      <p>Connect a device using the following API crendentials or
        <br />
        create a test thing <span ref="loading"></span>
      </p>
      <p><b>UUID:</b></p> <p><span className="selectable">{this.props.thing.uuid}</span></p>
      <p><b>TOKEN:</b></p> <p><span className="selectable">{this.props.thing.token}</span></p>
    </div>;
    const registeredText = <div>
      <SmartLight thing={this.props.thing} />
    </div>;
    const cardText = r ? registeredText : unregisteredText;
    return (
      <div>
        <Card style={thingStyle}>
          <CardTitle title={this.props.thing.name} />

          <CardText>
            {cardText}
          </CardText>
          <CardActions>
            { r ? null : <CreateComponent uuid={this.props.thing.uuid} token={this.props.thing.token} /> }
            <FlatButton label={r ? 'Delete': 'Cancel'} onTouchTap={this.handleOpen}/>
          </CardActions>
        </Card>
        <Dialog
          title="Are you sure?"
          actions={actions}
          modal={false}
          open={this.state.dltOpen}
          onRequestClose={this.handleClose}
        />
      </div>
    )

    // if (!this.props.thing.registeredAt) {
    //   return (
    //     <div>
    //       <Card style={thingStyle}>
    //         <CardTitle title={this.props.thing.name} />
    //         <CardText>
    //           <p>Connect a device using the following API crendentials or
    //             <br />
    //             create a test thing <span ref="loading"></span>
    //           </p>
    //           <p><b>UUID:</b></p> <p><span className="selectable">{this.props.thing.uuid}</span></p>
    //           <p><b>TOKEN:</b></p> <p><span className="selectable">{this.props.thing.token}</span></p>
    //         </CardText>
    //         <CardActions>
    //           <FlatButton label="Cancel" onTouchTap={this.handleOpen}/>
    //         </CardActions>
    //       </Card>
    //       <Dialog
    //         title="Are you sure?"
    //         actions={actions}
    //         modal={false}
    //         open={this.state.dltOpen}
    //         onRequestClose={this.handleClose}
    //       />
    //     </div>
    //   )
    // } else {
    //   // Stringify thing object for passing into a webcomponent
    //   const thing = JSON.stringify(this.props.thing);
    //   return (
    //     <div>
    //       <Card style={thingStyle}>
    //         <CardTitle title={this.props.thing.name} />
    //         <CardText>
    //           <this.props.thing.component thing={thing} />
    //         </CardText>
    //         <CardActions>
    //           <FlatButton label="Delete" onTouchTap={this.handleOpen}/>
    //         </CardActions>
    //       </Card>
    //       <Dialog
    //         title="Are you sure?"
    //         actions={actions}
    //         modal={false}
    //         open={this.state.dltOpen}
    //         onRequestClose={this.handleClose}
    //       />
    //     </div>
    //   )
    // }
  }
}
