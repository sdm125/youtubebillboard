app.controller('loaderCtrl', function($scope, billboardDate) {
  $scope.month = billboardDate.getBillboardMonth();
  $scope.day = billboardDate.getBillboardDay();
  $scope.year = billboardDate.getBillboardYear();

  $scope.$parent.$on('billBoardDateUpdated', function() {
    $scope.month = billboardDate.getBillboardMonth();
    $scope.day = billboardDate.getBillboardDay();
    $scope.year = billboardDate.getBillboardYear();
  });
});