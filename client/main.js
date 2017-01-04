import '../imports/ui';
import '../imports/collections';
import '../imports/api';
import '../imports/examples';

Meteor.startup(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(() => {
      // Registration was successful
      // console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch((err) => {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  }
});

