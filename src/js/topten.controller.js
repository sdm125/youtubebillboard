app.controller('toptenCtrl', function($rootScope, $scope, $http, $document, viewClass, billboardDate) {
  viewClass.setViewClass('top-ten');
  $scope.viewClass = viewClass.getViewClass();
  $scope.$parent.$broadcast('viewClassUpdated');

  $http.get(`/api/date?month=${billboardDate.getMonth()}&day=${billboardDate.getDay()}&year=${billboardDate.getYear()}`)
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

  $scope.toTheTop = function() {
    $document.scrollToElement(angular.element(document.getElementsByTagName('body')[0]), 500, 500);
  }
});
