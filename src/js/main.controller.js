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
