import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import '../imports/api';
import '../imports/things';
import Routes from '../imports/app/routes.jsx';
import injectTapEventPlugin from 'react-tap-event-plugin';
import './weather-icons.min.css';

Meteor.startup(() => {
  injectTapEventPlugin();
  render(<Routes />, document.getElementById('root'));
});
