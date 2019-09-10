app.controller('toptenCtrl', function($rootScope, $scope, $http, $document, viewClass, billboardDate) {
  viewClass.setViewClass('top-ten');
  $scope.viewClass = viewClass.getViewClass();
  $scope.$parent.$broadcast('viewClassUpdated');

  $scope.videoModal = {};
  $scope.videoModal.toggle = false;
  $scope.videoModal.videoIdUrl = '';

  $http.get(`/api/topten/date?month=${billboardDate.getMonth()}&day=${billboardDate.getDay()}&year=${billboardDate.getYear()}`)
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

  $scope.getVideoId = function(artist, song) {
    $scope.videoModal.toggle = true;
    var q = encodeURIComponent(artist) + '%20' + encodeURIComponent(song);
    $http.get('/api/video/search/?q=' + q).then(function(response) {
      $scope.videoModal.videoIdUrl = 'https://www.youtube.com/embed/' + response.data.id + '?version=3&enablejsapi=1';
    });
  }

  $scope.toTheTop = function() {
    $document.scrollToElement(angular.element(document.getElementsByTagName('body')[0]), 500, 500);
  }
});
