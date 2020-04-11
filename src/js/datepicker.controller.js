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
    console.log(res);
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
