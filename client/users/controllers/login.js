angular.module("grow").controller("LoginCtrl", ['$meteor', '$state',
  function ($meteor, $state) {
    var vm = this;

    vm.credentials = {
      email: '',
      password: ''
    };

    vm.error = '';

    vm.login = function () {
      $meteor.loginWithPassword(vm.credentials.email, vm.credentials.password).then(
        function () {
          $state.go('rooms');
        },
        function (err) {
          vm.error = 'Login error - ' + err;
        }
      );
    };
  }
]);