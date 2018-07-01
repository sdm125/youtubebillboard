'use strict';

var app = angular.module('youtubeBillboard', ['ngRoute', 'duScroll']);

app.config(($routeProvider) => {
  $routeProvider
  .when('/:month?/:day?/:year?', {
    templateUrl : 'templates/main.html',
    controller: 'mainCtrl'
  })
});

app.config(($sceDelegateProvider) => {
  $sceDelegateProvider.resourceUrlWhitelist([
    'self',                    // trust all resources from the same origin
    '*://www.youtube.com/**'   // trust all resources from `www.youtube.com`
  ]);
});

app.filter('monthName', [() => {
  return (monthNumber) => {
    return [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
             'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]
           [--monthNumber];
  }
}]);

/* Found here https://stackoverflow.com/questions/14878761/bind-class-toggle-to-window-scroll-event */
app.directive("scroll", function ($window) {
  return function(scope, element, attrs) {
    angular.element($window).bind("scroll", function() {
      if (this.pageYOffset >= 400) {
        scope.boolChangeClass = true;
      }
      else {
        scope.boolChangeClass = false;
      }
      scope.$apply();
    });
  };
});

app.controller('mainCtrl', function($scope, $routeParams, $http, $route, $location, $document) {
  $scope.month = parseInt($routeParams.month) || moment().month() + 1;
  $scope.day = parseInt($routeParams.day) || moment().date();
  $scope.year = parseInt($routeParams.year) || moment().year();
  $scope.maxYear = moment().year();
  $scope.maxMonth = $scope.year === moment().year() ? moment().month() + 1 : 12;
  moment.prototype.monthLength = ()=> moment($scope.year + '-' + $scope.month, 'YYYY-MM').daysInMonth();
  $scope.maxDay = $scope.year === moment().year() && $scope.month === moment().month() + 1 ? moment().date() : moment.prototype.monthLength();
  $scope.toggleDate = 'year';
  $scope.shareUrl = window.location.href;

  /* Update monthLength on change of month and years */
  $scope.$watchGroup(['month', 'year'], function(newVal,oldVal){
    if(newVal !== oldVal){
      $scope.maxDay = $scope.year === moment().year() && $scope.month === moment().month() + 1 ? moment().date() : moment.prototype.monthLength();
      $scope.maxMonth = $scope.year === moment().year() ? moment().month() + 1 : 12;
    }
  });

  if($routeParams.month !== undefined && $routeParams.day !== undefined && $routeParams.year !== undefined){
    recordLoader(true);
    $http.get(`/api/date?month=${$scope.month}&day=${$scope.day}&year=${$scope.year}`)
    .then(function(topTen){
      recordLoader(false)
      $scope.songs = topTen.data;
    }).catch(function(err){
      recordLoader(false);
      alert(`No chart found for ${$scope.month}-${$scope.day}-${$scope.year}`);
    })
  }

  $scope.dateSubmit = function(year, month, day){
    $scope.songs = [];
    recordLoader(true);
    $http.get(`/api/date?month=${month}&day=${day}&year=${year}`)
    .then(function(topTen){
      if (topTen.data === 'chart not found') throw 'Sorry, no top ten found for that date.';
      recordLoader(false);
      $scope.songs = topTen.data;
      $route.updateParams({month: $scope.month, day: $scope.day, year: $scope.year});
    })
    .catch((e) => {
      recordLoader(false);
      alert(e);
    })
  };

  function recordLoader(toggle){
    if(toggle){
      // angular.element($document.find('#record-loader')).addClass('toggle')
      document.getElementById('record-loader').style.opacity = '1';
      document.getElementById('record-loader').style.display = 'block';
    }
    else{
      document.getElementById('record-loader').style.opacity = '0';
      setTimeout(() => {
        if(document.getElementById('song1')){
          $document.scrollToElement(angular.element(document.getElementById('song1')), 75, 300);
          document.getElementById('record-loader').style.display = 'none';
        }
      }, 300);
    }
  }

  $scope.toTheTop = function() {
    $document.scrollToElement(angular.element(document.getElementsByTagName('body')[0]), 500, 500);
  }

  // $scope.numberRangeToArr = function(start, end, max){
  //   let arr = [start];
  //   let iNum = max ? Math.ceil((end - start) / max) : 1;
  //
  //   for(let i = iNum + start; i < (end - iNum); i+=iNum){
  //     arr.push(i);
  //   }
  //
  //   arr.push(end);
  //
  //   return arr;
  // }

});
