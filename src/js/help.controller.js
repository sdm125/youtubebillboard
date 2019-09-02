app.controller('helpCtrl', function($scope) {
  $scope.$on('toggledHelp', function(event, toggle) {
    $scope.help = toggle;
  });
});