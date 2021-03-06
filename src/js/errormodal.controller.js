app.controller('errorModalCtrl', function($scope, $location) {
  $scope.showErrorModal = {};
  $scope.errorModalMessage = {};
  $scope.showErrorModal.toggle = false;
  $scope.errorModalMessage.text = '';

  $scope.$on('toggleErrorModalUpdated', function(event, args) {
    $scope.showErrorModal.toggle = args.toggle;
    $scope.errorModalMessage.text = args.message;

    if (args.toggle) {
      $scope.$parent.$broadcast('toggleLoaderUpdated', false);
      $location.path('/');
    }
  });
});