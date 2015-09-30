angular.module('grow',['angular-meteor', 'ui.router']);

function onReady() {
  angular.bootstrap(document, ['grow']);
}

if (Meteor.isCordova)
  angular.element(document).on("deviceready", onReady);
else
  angular.element(document).ready(onReady);