import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import '../imports/api';
import '../imports/examples';
import Routes from '../imports/app/routes.jsx';
import injectTapEventPlugin from 'react-tap-event-plugin';
import './weather-icons.min.css';
import ApolloClient from 'apollo-client';
import { createMeteorNetworkInterface, meteorClientConfig } from 'meteor/apollo';
import { ApolloProvider } from 'react-apollo';

// const graphqlSettings = Meteor.settings.graphql || {};
// const uri = graphqlSettings.uri || 'http://localhost:3010/graphql';
const networkInterface = createMeteorNetworkInterface({
  // uri,
  useMeteorAccounts: true
});
const client = new ApolloClient(meteorClientConfig({ networkInterface }));

Meteor.startup(() => {
  injectTapEventPlugin();
  render(
    <ApolloProvider client={client}>
      <Routes />
    </ApolloProvider>
    , document.getElementById('root')
  );
});
