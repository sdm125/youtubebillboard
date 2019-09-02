'use strict';

const app = angular.module('youtubeBillboard', ['ngRoute', 'duScroll', 'ngAnimate']);

app.config(($routeProvider, $sceDelegateProvider) => {
  $routeProvider.when('/', {
    templateUrl: 'templates/datepicker.html',
    controller: 'mainCtrl'
  })
  .when('/:month/:day/:year', {
    templateUrl: 'templates/topten.html',
    controller: 'toptenCtrl'
  })
  .otherwise({
    redirectTo: '/'
  });

  $sceDelegateProvider.resourceUrlWhitelist([
    'self',                    // trust all resources from the same origin
    '*://www.youtube.com/**'   // trust all resources from `www.youtube.com`
  ]);
});

// Found here https://stackoverflow.com/questions/14878761/bind-class-toggle-to-window-scroll-event
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

app.factory('viewClass', function() {
  var service = {};
  var _viewClass = '';

  service.setViewClass = function(className) {
    _viewClass = className;
  }

  service.getViewClass = function() {
    return _viewClass;
  }

  return service;
});

app.factory('billboardDate', function() {
  var service = {};
  var _month = 0;
  var _day = 0;
  var _year = 0;

  service.setBillboardDate = function(month, day, year) {
    _month = month;
    _day = day;
    _year = year;
  }

  service.getMonth = function() {
    return _month;
  }

  service.getDay = function() {
    return _day;
  }

  service.getYear = function() {
    return _year;
  }

  return service;
});

app.filter('monthName', [() => {
  return monthNumber => {
    return [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
             'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]
           [--monthNumber];
  };
}]);

app.controller('errorModalCtrl', function($scope) {
  $scope.showErrorModal = {};
  $scope.errorModalMessage = {};
  $scope.showErrorModal.toggle = false;
  $scope.errorModalMessage.text = '';

  $scope.$on('toggleErrorModalUpdated', function(event, args) {
    $scope.showErrorModal.toggle = args.toggle;
    $scope.errorModalMessage.text = args.message;
  });
});
app.controller('helpCtrl', function($scope) {
  $scope.$on('toggledHelp', function(event, toggle) {
    $scope.help = toggle;
  });
});
app.controller('loaderCtrl', function($scope, billboardDate) {
  $scope.showLoader = {};
  $scope.showLoader.toggle = false;
  $scope.month = billboardDate.getMonth();
  $scope.day = billboardDate.getDay();
  $scope.year = billboardDate.getYear();

  $scope.$on('billBoardDateUpdated', function() {
    $scope.month = billboardDate.getMonth();
    $scope.day = billboardDate.getDay();
    $scope.year = billboardDate.getYear();
  });

  $scope.$on('toggleLoaderUpdated', function(event, toggle) {
    $scope.showLoader.toggle = toggle;
  });
});
app.controller('mainCtrl', function($rootScope, $scope, $location, viewClass, billboardDate) {
  $scope.month = billboardDate.getMonth() || 7;
  $scope.day = billboardDate.getDay() || 16;
  $scope.year = billboardDate.getYear() || parseInt(((moment().year() - 1958) / 2) + 1958);

  $scope.showMonthPlaceholder = billboardDate.getMonth() !== 0 ? false : true;
  $scope.showDayPlaceholder = billboardDate.getDay() !== 0 ? false : true;
  $scope.showYearPlaceholder = billboardDate.getYear() !== 0 ? false : true;

  $scope.hidePlaceholder = function(placerholderName) {
    if ($scope[placerholderName]) {
      $scope[placerholderName] = false;
    }
  }
 
  // Date limits
  moment.prototype.monthLength = () => {
    return moment($scope.year + '-' + $scope.month, 'YYYY-MM').daysInMonth();
  }
  $scope.maxYear = moment().year();
  $scope.maxMonth = $scope.year === moment().year() ? moment().month() + 1 : 12;
  $scope.maxDay = $scope.year === moment().year() && $scope.month === moment().month() + 1 ? moment().date() : moment.prototype.monthLength();

  // Set initial date slider to year
  $scope.toggleDate = 'year';

  // Set view class to date picker
  viewClass.setViewClass('date-picker');
  $scope.viewClass = viewClass.getViewClass();
  $rootScope.$broadcast('viewClassUpdated');

  // Make these values available to scope
  $scope.currentYear = new Date().getFullYear();

  // Update monthLength on change of month and years
  $scope.$watchGroup(['month', 'day', 'year'], function(newVal,oldVal) {
    if (newVal !== oldVal) {
      $scope.maxDay = $scope.year === moment().year() && $scope.month === moment().month() + 1 ? moment().date() : moment.prototype.monthLength();
      $scope.maxMonth = $scope.year === moment().year() ? moment().month() + 1 : 12;
    }
  });

  $scope.dateSubmit = function() {
    if (validateDate($scope.month, $scope.day, $scope.year)) {
      billboardDate.setBillboardDate($scope.month, $scope.day, $scope.year);
      $rootScope.$broadcast('billBoardDateUpdated');
      $rootScope.$broadcast('toggleLoaderUpdated', true);
      $location.path(`/${$scope.month}/${$scope.day}/${$scope.year}/`);
    }
    else {
      $rootScope.$broadcast('toggleErrorModalUpdated', {toggle: true, message: 'Please enter a valid date.'});
    }
  };

  function validateDate(month, day, year) {
    if ($scope.showDayPlaceholder || $scope.showMonthPlaceholder || $scope.showYearPlaceholder) {
      return false;
    }
    else {
      month = month < 10 ? `0${new Number(month).toString().replace('0', '')}` : month;
      day = day < 10 ? `0${new Number(day).toString().replace('0', '')}` : day;
      let date = `${year}-${month}-${day}`;
      return moment(date).isValid() && moment(moment(new Date()).diff(date, 'days')) >= 0;
    }
  }
});

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
app.controller('toptenCtrl', function($rootScope, $scope, $http, $document, viewClass, billboardDate) {
  viewClass.setViewClass('top-ten');
  $scope.viewClass = viewClass.getViewClass();
  $scope.$parent.$broadcast('viewClassUpdated');

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

  $scope.toTheTop = function() {
    $document.scrollToElement(angular.element(document.getElementsByTagName('body')[0]), 500, 500);
  }
});
