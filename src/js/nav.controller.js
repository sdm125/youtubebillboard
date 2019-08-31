app.controller('navCtrl', function($scope, viewClass, billboardDate, toggleHelp) {
  $scope.viewClass = viewClass.getViewClass();
  $scope.showHelp = toggleHelp.getToggleHelp();
  
  $scope.help = function() {
    toggleHelp.toggleHelp();
    $scope.$parent.$broadcast('toggledHelp');
  };

  $scope.$parent.$on('viewClassUpdated', function() {
    $scope.viewClass = viewClass.getViewClass();
  })

  $scope.$parent.$on('billBoardDateUpdated', function() {
    $scope.month = billboardDate.getBillboardMonth();
    $scope.day = billboardDate.getBillboardDay();
    $scope.year = billboardDate.getBillboardYear();
  });
});