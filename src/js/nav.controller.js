app.controller('navCtrl', function($scope, viewClass, billboardDate) {
  $scope.viewClass = viewClass.getViewClass();
  $scope.showHelp = false;
  
  $scope.help = function() {
    $scope.showHelp = !$scope.showHelp;
    $scope.$parent.$broadcast('toggledHelp', $scope.showHelp);
  };

  $scope.$on('viewClassUpdated', function() {
    $scope.viewClass = viewClass.getViewClass();
  })

  $scope.$on('billBoardDateUpdated', function() {
    $scope.month = billboardDate.getMonth();
    $scope.day = billboardDate.getDay();
    $scope.year = billboardDate.getYear();
  });
});