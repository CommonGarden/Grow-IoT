angular.module("grow").run(['$rootScope', '$state', function($rootScope, $state) {
  $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
    // We can catch the error thrown when the $requireUser promise is rejected
    // and redirect the user back to the main page
    if (error === 'AUTH_REQUIRED') {
      $state.go('rooms');
    }
  });
}]);

angular.module("grow").config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
  function ($urlRouterProvider, $stateProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    $stateProvider
      .state('rooms', {
        url: '/rooms',
        templateUrl: 'client/rooms/views/rooms-list.ng.html',
        controller: 'RoomsListCtrl'
      })
      .state('roomDetails', {
        url: '/rooms/:roomId',
        templateUrl: 'client/rooms/views/room-details.ng.html',
        controller: 'RoomDetailsCtrl',
        resolve: {
          "currentUser": ["$meteor", function($meteor){
            return $meteor.requireUser();
          }]
        }
      })
      .state('login', {
        url: '/login',
        templateUrl: 'client/users/views/login.ng.html',
        controller: 'LoginCtrl',
        controllerAs: 'lc'
      })
      .state('register',{
        url: '/register',
        templateUrl: 'client/users/views/register.ng.html',
        controller: 'RegisterCtrl',
        controllerAs: 'rc'
      })
      .state('resetpw', {
        url: '/resetpw',
        templateUrl: 'client/users/views/reset-password.ng.html',
        controller: 'ResetCtrl',
        controllerAs: 'rpc'
      })
      .state('logout', {
        url: '/logout',
        resolve: {
          "logout": ['$meteor', '$state', function($meteor, $state) {
            return $meteor.logout().then(function(){
              $state.go('rooms');
            }, function(err){
              console.log('logout error - ', err);
            });
          }]
        }
      });

    $urlRouterProvider.otherwise("/rooms");
  }]);