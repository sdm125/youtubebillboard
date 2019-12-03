app.controller('toptenCtrl', function($rootScope, $scope, $routeParams, $http, $document, viewClass, videoModalToggle, toastToggle, billboardDate) {
  viewClass.setViewClass('top-ten');
  $scope.viewClass = viewClass.getViewClass();
  $scope.$parent.$broadcast('viewClassUpdated');

  if (!billboardDate.getMonth() || !billboardDate.getDay() || !billboardDate.getYear()) {
    billboardDate.setBillboardDate(parseInt($routeParams.month), parseInt($routeParams.day), parseInt($routeParams.year));
    $rootScope.$broadcast('billBoardDateUpdated');
  }

  $scope.videoModal = {};
  $scope.videoModal.toggle = videoModalToggle.getToggle();
  $scope.videoModal.videoIdUrl = '';
  $scope.page = 1;
  $scope.minPage = 1;
  $scope.maxPage = 5;

  $scope.toastToggle = toastToggle.getToggle();

  $scope.$on('toastToggleUpdated', function() {
    $scope.toastToggle = toastToggle.getToggle();
  });

  $scope.$on('videoModalToggleUpdated', function() {
    $scope.videoModal.toggle = videoModalToggle.getToggle();
  });

  $scope.closeVideoModal = function() {
    $scope.videoModal.toggle = !$scope.videoModal.toggle;
    videoModalToggle.setToggle($scope.videoModal.toggle);
    $rootScope.$broadcast('videoModalToggleUpdated');
  };

  $scope.updatePageMinMax = function() {
    $scope.maxPage = ($scope.page - 2) < 1 ? 5 : (($scope.page + 2) <= 10 ? ($scope.page + 2) : 10);
    $scope.minPage = ($scope.page - 2) < 1 ? 1 : (($scope.page - 2) <= 6 ? ($scope.page - 2) : 6); 
  };

  $scope.getTopTen = function(page) {
    $http.get(`/api/topten/date?month=${$scope.month}&day=${$scope.day}&year=${$scope.year}&page=${page}`)
    .then(function(topTen){
      if (topTen.data.hasOwnProperty('error')) {
        throw 'Sorry, no top ten found for that date.';
      }
      else {
        $scope.songs = topTen.data;
        $rootScope.$broadcast('toggleLoaderUpdated', false);
      }
    }).catch(error => {
      $rootScope.$broadcast('toggleErrorModalUpdated', {toggle: true, message: 'Opps, something went wrong :('});
    });

    $scope.page = page;
    $scope.updatePageMinMax();
  };

  $scope.getTopTen(1);

  $scope.getVideoId = function(artist, song) {
    videoModalToggle.setToggle(true);
    $rootScope.$broadcast('videoModalToggleUpdated');
    $scope.videoModal.toggle = videoModalToggle.getToggle();
    $http.get('/api/video/search/?artist=' + encodeURIComponent(artist) + '&song=' + encodeURIComponent(song)).then(function(response) {
      $scope.videoModal.videoIdUrl = 'https://www.youtube.com/embed/' + response.data.id + '?version=3&enablejsapi=1&playsinline=1';
    });
  };

  $scope.toTheTop = function() {
    $document.scrollToElement(angular.element(document.getElementsByTagName('body')[0]), 500, 500);
  };
  $scope.toTheTop();
});
