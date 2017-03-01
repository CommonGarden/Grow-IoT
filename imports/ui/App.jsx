import React, { Component } from 'react';

// App component - represents the whole app
export default class App extends Component {
  render() {
    return (
      <div className="container">
        <global-toast id="global_toast"/>
        <root-layout/>
      </div>
    );
  }
}
