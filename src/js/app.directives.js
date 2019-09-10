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

app.directive("videoControls", function () {
  return {
    restrict: 'A',
    scope: {
      modal: '='
    },
    link: function(scope, element) {
      scope.$watch('modal', function(newVal, oldVal) {
        if (newVal.toggle !== oldVal.toggle && !newVal.toggle) {
          element[0].contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
          setTimeout(function() {
            element[0].style.opacity = '0';
          }, 500);
        }
        else if (newVal.toggle !== oldVal.toggle && newVal.toggle) {
          if (element[0].style.opacity === '0') {
            element[0].onload = function() {
              this.style.opacity = '1';
            }
          }
        }
      }, true);
    }
  };
});
