angular.module("grow").controller("RoomDetailsCtrl", ['$scope', '$stateParams', '$meteor',
  function ($scope, $stateParams, $meteor) {
    $scope.room = $meteor.object(Rooms, $stateParams.roomId).subscribe('rooms');
    $scope.users = $meteor.collection(Meteor.users, false).subscribe('users');
  }]);
