app.controller('helpCtrl', function($scope, toggleHelp) {
  $scope.help = toggleHelp.getToggleHelp();
  $scope.$parent.$on('toggledHelp', function() {
    $scope.help = toggleHelp.getToggleHelp();
  })
});