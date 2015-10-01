angular.module("grow").controller("ResetCtrl", ['$meteor', '$state',
  function ($meteor, $state) {
    var vm = this;

    vm.credentials = {
      email: ''
    };

    vm.error = '';

    vm.reset = function () {
      $meteor.forgotPassword(vm.credentials.email).then(
        function () {
          $state.go('rooms');
        },
        function (err) {
          vm.error = 'Error sending forgot password email - ' + err;
        }
      );
    };
  }
]);