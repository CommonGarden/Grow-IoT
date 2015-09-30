angular.module("grow").controller("RoomsListCtrl", ['$scope', '$meteor',
  function($scope, $meteor){

    $scope.rooms = $meteor.collection(Rooms).subscribe('rooms');

    $scope.remove = function(room){
      $scope.rooms.splice( $scope.rooms.indexOf(room), 1 );
    };

    $scope.removeAll = function(){
      $scope.rooms.remove();
    };
  }]);