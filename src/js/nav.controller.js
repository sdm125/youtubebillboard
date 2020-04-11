app.controller('navCtrl', function (
  $scope,
  $location,
  $timeout,
  viewClass,
  videoModalToggle,
  billboardDate,
  toastToggle
) {
  $scope.viewClass = viewClass.getViewClass();
  $scope.videoModalToggle = videoModalToggle.getToggle();
  $scope.showHelp = false;

  $scope.$on('viewClassUpdated', function () {
    $scope.viewClass = viewClass.getViewClass();
  });

  $scope.$on('videoModalToggleUpdated', function () {
    $scope.videoModalToggle = videoModalToggle.getToggle();
  });

  // https://stackoverflow.com/questions/29267589/angularjs-copy-to-clipboard
  $scope.copyLink = function () {
    // create temp element
    var copyElement = document.createElement('span');
    copyElement.appendChild(document.createTextNode($location.$$absUrl));
    copyElement.id = 'tempCopyToClipboard';
    angular.element(document.body.append(copyElement));

    // select the text
    var range = document.createRange();
    range.selectNode(copyElement);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);

    // copy & cleanup
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    copyElement.remove();

    toastToggle.setToggle(true);
    $scope.$parent.$broadcast('toastToggleUpdated', toastToggle.getToggle);

    $timeout(function () {
      toastToggle.setToggle(false);
      $scope.$parent.$broadcast('toastToggleUpdated', toastToggle.getToggle);
    }, 3000);
  };

  $scope.help = function () {
    $scope.showHelp = !$scope.showHelp;
    $scope.$parent.$broadcast('toggledHelp', $scope.showHelp);
  };

  $scope.back = function () {
    if ($scope.videoModalToggle) {
      $scope.videoModalToggle = !$scope.videoModalToggle;
      videoModalToggle.setToggle($scope.videoModalToggle);
      $scope.$parent.$broadcast('videoModalToggleUpdated');
    } else {
      $location.path('/');
    }
  };

  $scope.$on('billBoardDateUpdated', function () {
    $scope.month = billboardDate.getMonth();
    $scope.day = billboardDate.getDay();
    $scope.year = billboardDate.getYear();
  });
});
