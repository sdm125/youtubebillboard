app.controller('loaderCtrl', function($scope, billboardDate) {
  $scope.showLoader = {};
  $scope.showLoader.toggle = false;
  $scope.month = billboardDate.getMonth();
  $scope.day = billboardDate.getDay();
  $scope.year = billboardDate.getYear();

  $scope.$on('billBoardDateUpdated', function() {
    $scope.month = billboardDate.getMonth();
    $scope.day = billboardDate.getDay();
    $scope.year = billboardDate.getYear();
  });

  $scope.$on('toggleLoaderUpdated', function(event, toggle) {
    $scope.showLoader.toggle = toggle;
  });
});