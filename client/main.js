import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import '../imports/api';
import '../imports/examples';
import Routes from '../imports/app/routes.jsx';
import injectTapEventPlugin from 'react-tap-event-plugin';
import 'weather-icons/css/weather-icons.min.css';

Meteor.startup(() => {
  injectTapEventPlugin();
  render(<Routes />, document.getElementById('root'));
});

// Meteor.startup(() => {
  // if ('serviceWorker' in navigator) {
    // navigator.serviceWorker.register('/sw.js').then(() => {
      // // Registration was successful
      // // console.log('ServiceWorker registration successful with scope: ', registration.scope);
    // }).catch((err) => {
      // // registration failed :(
      // console.log('ServiceWorker registration failed: ', err);
    // });
  // }
// });

