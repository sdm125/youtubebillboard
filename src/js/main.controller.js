app.controller('mainCtrl', function($scope, $routeParams, $http, $route, $location, $document) {
  // Get date values from URL or set to current date if no date in URL.
  $scope.month = parseInt($routeParams.month) || moment().month() + 1;
  $scope.day = parseInt($routeParams.day) || moment().date();
  $scope.year = parseInt($routeParams.year) || moment().year();

  // Date limits
  moment.prototype.monthLength = () => {
    return moment($scope.year + '-' + $scope.month, 'YYYY-MM').daysInMonth();
  }
  $scope.maxYear = moment().year();
  $scope.maxMonth = $scope.year === moment().year() ? moment().month() + 1 : 12;
  $scope.maxDay = $scope.year === moment().year() && $scope.month === moment().month() + 1 ? moment().date() : moment.prototype.monthLength();

  // Set initial date slider to year
  $scope.toggleDate = 'year';

  $scope.viewData = {};

  // Set initial view class to date picker
  $scope.viewData.className = 'date-picker'; 

  // Make these values available to scope
  $scope.currentYear = new Date().getFullYear();

  // Update monthLength on change of month and years
  $scope.$watchGroup(['month', 'year'], function(newVal,oldVal) {
    if (newVal !== oldVal) {
      $scope.maxDay = $scope.year === moment().year() && $scope.month === moment().month() + 1 ? moment().date() : moment.prototype.monthLength();
      $scope.maxMonth = $scope.year === moment().year() ? moment().month() + 1 : 12;
    }
  });

  if ($routeParams.month !== undefined && $routeParams.day !== undefined && $routeParams.year !== undefined) {
    if (validateDate($routeParams.month, $routeParams.day, $routeParams.year)) {
      recordLoader(true);
      $http.get(`/api/date?month=${$scope.month}&day=${$scope.day}&year=${$scope.year}`)
      .then(function(topTen){
        if (topTen.data.hasOwnProperty('error')) throw 'Sorry, no top ten found for that date.';
        $scope.viewData.className = 'top-ten';
        $scope.songs = topTen.data;
        recordLoader(false);
      }).catch((e) => {
        recordLoader(false);
        toggleErrorModal(e);
      });
    }
    else {
      toggleErrorModal('Please enter a valid date.')
    }
  }

  $scope.dateSubmit = function(year, month, day) {
    $scope.songs = [];
    recordLoader(true);
    $http.get(`/api/date?month=${month}&day=${day}&year=${year}`)
    .then(function(topTen){
      if (topTen.data.hasOwnProperty('error')) throw 'Sorry, no top ten found for that date.';
      $scope.songs = topTen.data;
      $location.path(`/${month}/${day}/${year}/`);
      $scope.$on("$routeChangeSuccess", function(){
        recordLoader(false);
      });
    }).catch(error => {
      recordLoader(false);
      toggleErrorModal(error);
    });
  };

  function validateDate(month, day, year) {
    month = month < 10 ? `0${month.replace('0', '')}` : month;
    day = day < 10 ? `0${day.replace('0', '')}` : day;
    let date = `${year}-${month}-${day}`;
    return moment(date).isValid() && moment(moment(new Date()).diff(date, 'days')) >= 0;
  }

  function recordLoader(toggle) {
    if (toggle) {
      // angular.element($document.find('#record-loader')).addClass('toggle')
      document.getElementById('record-loader').style.opacity = '1';
      document.getElementById('record-loader').style.display = 'flex';
    }
    else {
      document.getElementById('record-loader').style.opacity = '0';
      setTimeout(() => {
        document.getElementById('record-loader').style.display = 'none';
      }, 300);
    }
  };

  function toggleErrorModal(msg) {
    $scope.$parent.errorModal = !$scope.$parent.errorModal;
    $scope.$parent.errorMessage = msg;
  }

  $scope.toTheTop = function() {
    $document.scrollToElement(angular.element(document.getElementsByTagName('body')[0]), 500, 500);
  }

  $scope.numberRangeToArr = function(start, end, max){
    let arr = [start];
    let iNum =  Math.ceil((end - start) / max);

    for(let i = (start + iNum); i <= (end - iNum); i+=iNum){
      arr.push(i);
    }

    arr.push(end);
    return arr;
  }
});
