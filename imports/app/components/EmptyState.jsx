import React, { Component } from 'react';
import Paper from 'material-ui/Paper';

const style = {
  height: 375,
  width: 375,
  margin: 20,
  textAlign: 'center',
  display: 'inline-block',
};

export default class EmptyState extends Component {
  render(){
    return (
      <div>
        <Paper style={style} zDepth={1} circle={true} >
          <div className="layout vertical center center-justified"
            style={{height: '100%', fontSize: 20}}>
            {
              this.props.children || `Click the + button to create a new thing.` 
            }
          </div>
        </Paper>
      </div>
    );
  }
};
