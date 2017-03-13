/* global Connectivity */
import { ReactiveVar } from 'meteor/reactive-var'

Meteor.startup(() => {
  const config = {
    maxLatency: 2000,
    retryInterval: 1000,
    onError: () => {
    },
  };
  Connectivity.monitor(config);
  Connectivity._networkStatus = new ReactiveVar(false);
  function updateNetworkStatus() {
    Connectivity._networkStatus.set(navigator.onLine);
  }

  // Update the online status icon based on connectivity
  window.addEventListener('online',  updateNetworkStatus);
  window.addEventListener('offline', updateNetworkStatus);
  updateNetworkStatus();

});
