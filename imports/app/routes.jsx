import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { BrowserRouter as Router, Route, Redirect, Link } from 'react-router-dom';
import App from './App.jsx';

export default class Routes extends Component {
  render() {
    return (
      <Router>
        <div>
          <App />
        </div>
      </Router>
    );
  }
};
