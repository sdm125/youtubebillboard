'use strict';

const app = angular.module('youtubeBillboard', [
  'ngRoute',
  'duScroll',
  'ngAnimate',
]);

app.config(($routeProvider, $sceDelegateProvider) => {
  $routeProvider
    .when('/', {
      templateUrl: 'templates/datepicker.html',
      controller: 'datePickerCtrl',
    })
    .when('/:month/:day/:year', {
      templateUrl: 'templates/topten.html',
      controller: 'toptenCtrl',
    })
    .otherwise({
      redirectTo: '/',
    });

  $sceDelegateProvider.resourceUrlWhitelist([
    'self', // trust all resources from the same origin
    'https://www.youtube.com/**', // trust all resources from `www.youtube.com`
  ]);
});

// Found here https://stackoverflow.com/questions/14878761/bind-class-toggle-to-window-scroll-event
app.directive('scroll', function ($window) {
  return function (scope, element, attrs) {
    angular.element($window).bind('scroll', function () {
      if (this.pageYOffset >= 400) {
        scope.boolChangeClass = true;
      } else {
        scope.boolChangeClass = false;
      }
      scope.$apply();
    });
  };
});

// https://stackoverflow.com/questions/26170029/ng-touchstart-and-ng-touchend-in-angularjs
app.directive('myTouchstart', [
  function () {
    return function (scope, element, attr) {
      element.on('touchstart', function (event) {
        scope.$apply(function () {
          scope.$eval(attr.myTouchstart);
        });
      });
    };
  },
]);

app.directive('lazyLoadVideo', function () {
  return {
    restrict: 'E',
    template:
      '<div class="videowrapper d-none"></div>' +
      '<i class="fab fa-youtube"></i>' +
      '<img class="w-100" ng-src="{{ imagesrc }}">',
    link: function (scope, element, attrs) {
      scope.imagesrc = attrs.imagesrc;
      scope.iframesrc = attrs.iframesrc;
      var children = element.children();
      var iframe;
      var youtubeIcon;
      var previewImage;
      var videoWrapper;

      element.on('click', function () {
        for (var i = 0; i < children.length; i++) {
          if (children[i].tagName.toLowerCase() === 'i') {
            youtubeIcon = children[i];
          } else if (children[i].tagName.toLowerCase() === 'img') {
            previewImage = children[i];
          } else if (children[i].classList.contains('videowrapper')) {
            videoWrapper = children[i];
          }
        }

        iframe = document.createElement('iframe');
        iframe.src = scope.iframesrc;
        videoWrapper.appendChild(iframe);
        iframe.onload = function () {
          videoWrapper.classList.remove('d-none');
          youtubeIcon.remove();
          previewImage.remove();
        };
      });
    },
  };
});

app.directive('videoControls', function () {
  return {
    restrict: 'A',
    scope: {
      modal: '=',
    },
    link: function (scope, element) {
      scope.$watch(
        'modal',
        function (newVal, oldVal) {
          if (newVal.toggle !== oldVal.toggle && !newVal.toggle) {
            element[0].contentWindow.postMessage(
              '{"event":"command","func":"stopVideo","args":""}',
              '*'
            );
            setTimeout(function () {
              element[0].style.opacity = '0';
            }, 500);
          } else if (newVal.toggle !== oldVal.toggle && newVal.toggle) {
            if (element[0].style.opacity === '0') {
              if (newVal.videoIdUrl === oldVal.videoIdUrl) {
                element[0].style.opacity = '1';
              } else {
                element[0].onload = function () {
                  this.style.opacity = '1';
                };
              }
            }
          }
        },
        true
      );
    },
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

app.factory('videoModalToggle', function() {
  var service = {};
  var _toggle = false;

  service.setToggle = function(toggle) {
    _toggle = toggle;
  }

  service.getToggle = function() {
    return _toggle;
  }

  return service;
});

app.factory('toastToggle', function() {
  var service = {};
  var _toggle = false;

  service.setToggle = function(toggle) {
    _toggle = toggle;
  }

  service.getToggle = function() {
    return _toggle;
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

app.controller('datePickerCtrl', function (
  $document,
  $rootScope,
  $scope,
  $location,
  $http,
  viewClass,
  videoModalToggle,
  billboardDate
) {
  $document.scrollToElement(
    angular.element(document.getElementsByTagName('body')[0]),
    0,
    0
  );
  $scope.month = billboardDate.getMonth() || 7;
  $scope.day = billboardDate.getDay() || 16;
  $scope.year =
    billboardDate.getYear() || parseInt((moment().year() - 1958) / 2 + 1958);
  $scope.currentYear = moment().year();

  $scope.videoModalToggle = videoModalToggle.getToggle();

  $scope.$on('videoModalToggleUpdated', function () {
    $scope.videoModalToggle = videoModalToggle.getToggle();
  });

  $scope.showMonthPlaceholder = billboardDate.getMonth() !== 0 ? false : true;
  $scope.showDayPlaceholder = billboardDate.getDay() !== 0 ? false : true;
  $scope.showYearPlaceholder = billboardDate.getYear() !== 0 ? false : true;

  $scope.hidePlaceholder = function (placerholderName) {
    if ($scope[placerholderName]) {
      $scope[placerholderName] = false;
    }
  };

  moment.prototype.monthLength = () => {
    return moment($scope.year + '-' + $scope.month, 'YYYY-MM').daysInMonth();
  };

  // Date limits
  var maxDate = moment(new Date()).subtract(moment().day() + 1, 'days');
  $scope.maxYear = moment().year();
  $scope.maxMonth = $scope.year === moment().year() ? maxDate.month() + 1 : 12;
  // If selected year is current year and selected month is m max month, maxDay is previous saturday
  // otherwise maxDay is number of days in month.
  $scope.maxDay =
    $scope.year === moment().year() && $scope.month === maxDate.month() + 1
      ? maxDate.date()
      : moment.prototype.monthLength();

  // Set initial date slider to year
  $scope.toggleDate = 'year';

  // Set view class to date picker
  viewClass.setViewClass('date-picker');
  $scope.viewClass = viewClass.getViewClass();
  $rootScope.$broadcast('viewClassUpdated');

  // Make these values available to scope
  $scope.currentYear = new Date().getFullYear();

  // Update monthLength on change of month and years
  $scope.$watchGroup(['month', 'day', 'year'], function (newVal, oldVal) {
    if (newVal !== oldVal) {
      $scope.maxMonth =
        $scope.year === moment().year() ? maxDate.month() + 1 : 12;

      $scope.maxDay =
        $scope.year === moment().year() && $scope.maxMonth === $scope.month
          ? maxDate.date()
          : moment.prototype.monthLength();
    }
  });

  $http.get('/api/topten/random/').then(function (res) {
    $scope.randomSongs = res.data;
  });

  $scope.dateSubmit = function () {
    if (validateDate($scope.month, $scope.day, $scope.year)) {
      billboardDate.setBillboardDate($scope.month, $scope.day, $scope.year);
      $rootScope.$broadcast('billBoardDateUpdated');
      $rootScope.$broadcast('toggleLoaderUpdated', true);
      $location.path(`/${$scope.month}/${$scope.day}/${$scope.year}/`);
    } else {
      $rootScope.$broadcast('toggleErrorModalUpdated', {
        toggle: true,
        message: 'Please enter a valid date.',
      });
    }
  };

  function validateDate(month, day, year) {
    if (
      $scope.showDayPlaceholder ||
      $scope.showMonthPlaceholder ||
      $scope.showYearPlaceholder
    ) {
      return false;
    } else {
      month =
        month < 10
          ? `0${new Number(month).toString().replace('0', '')}`
          : month;
      day = day < 10 ? `0${new Number(day).toString().replace('0', '')}` : day;
      let date = `${year}-${month}-${day}`;
      return (
        moment(date).isValid() &&
        moment(moment(new Date()).diff(date, 'days')) >= 0
      );
    }
  }
});

app.controller('errorModalCtrl', function($scope, $location) {
  $scope.showErrorModal = {};
  $scope.errorModalMessage = {};
  $scope.showErrorModal.toggle = false;
  $scope.errorModalMessage.text = '';

  $scope.$on('toggleErrorModalUpdated', function(event, args) {
    $scope.showErrorModal.toggle = args.toggle;
    $scope.errorModalMessage.text = args.message;

    if (args.toggle) {
      $scope.$parent.$broadcast('toggleLoaderUpdated', false);
      $location.path('/');
    }
  });
});
app.controller('footerCtrl', function($scope) {
  $scope.currentYear = new Date().getFullYear();
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
    $scope.maxPage = (($scope.page - 2) < 1) ? 5 : (($scope.page + 2) <= 10 ? ($scope.page + 2) : 10);
    $scope.minPage = (($scope.page - 2) < 1) ? 1 : (($scope.page - 2) <= 6 ? ($scope.page - 2) : 6); 
  };

  $scope.getTopTen = function(page) {
    $http.get(`/api/topten/date?month=${billboardDate.getMonth()}&day=${billboardDate.getDay()}&year=${billboardDate.getYear()}&page=${page}`)
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
