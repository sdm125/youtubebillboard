app.controller('navCtrl', function($scope, $location, $timeout, viewClass, videoModalToggle, billboardDate, toastToggle) {
  $scope.viewClass = viewClass.getViewClass();
  $scope.videoModalToggle = videoModalToggle.getToggle();
  $scope.showHelp = false;
  
  $scope.$on('viewClassUpdated', function() {
    $scope.viewClass = viewClass.getViewClass();
  });

  $scope.$on('videoModalToggleUpdated', function() {
    $scope.videoModalToggle = videoModalToggle.getToggle();
  });

  // Found parts of this here https://stackoverflow.com/questions/43139185/how-to-copy-a-string-to-clipboard-with-ng-click-in-angularjs
  $scope.copyLink = function(event) {
    var body = document.querySelector('body');
    var copyElement = document.createElement('textarea');
    copyElement.style.height = 0;
    copyElement.style.width = 0;
    copyElement.style.position = 'absolute';
    copyElement.style.top = '50000px';
    copyElement.textContent = $location.$$absUrl;
    body.appendChild(copyElement);
    copyElement.select();
    document.execCommand('copy');
    body.removeChild(copyElement);

    toastToggle.setToggle(true);
    $scope.$parent.$broadcast('toastToggleUpdated', toastToggle.getToggle);
    
    $timeout(function() {
      toastToggle.setToggle(false);
      $scope.$parent.$broadcast('toastToggleUpdated', toastToggle.getToggle);
    }, 3000);
  };
  
  $scope.help = function() {
    $scope.showHelp = !$scope.showHelp;
    $scope.$parent.$broadcast('toggledHelp', $scope.showHelp);
  };

  $scope.back = function() {
    if ($scope.videoModalToggle) {
      $scope.videoModalToggle = !$scope.videoModalToggle;
      videoModalToggle.setToggle($scope.videoModalToggle);
      $scope.$parent.$broadcast('videoModalToggleUpdated');
    }
    else {
      $location.path('/');
    }
  };

  $scope.$on('billBoardDateUpdated', function() {
    $scope.month = billboardDate.getMonth();
    $scope.day = billboardDate.getDay();
    $scope.year = billboardDate.getYear();
  });
});