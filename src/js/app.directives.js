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

app.directive('lazyLoadVideo', function() {
  return {
    restrict: 'E',
    template: '<div class="videowrapper d-none"></div>' +
              '<i class="fab fa-youtube"></i>' +
              '<img class="w-100" ng-src="{{ imagesrc }}">',
    link: function(scope, element, attrs) {
      scope.imagesrc = attrs.imagesrc;
      scope.iframesrc = attrs.iframesrc;
      var children = element.children();
      var iframe;
      var youtubeIcon;
      var previewImage;
      var videoWrapper;

      element.on('click', function() {
        for (var i = 0; i < children.length; i++) {
          if (children[i].tagName.toLowerCase() === 'i') {
            youtubeIcon = children[i];
          }
          else if (children[i].tagName.toLowerCase() === 'img') {
            previewImage = children[i];
          }
          else if (children[i].classList.contains('videowrapper')) {
            videoWrapper = children[i];
          }
        }

        iframe = document.createElement('iframe');
        iframe.src = scope.iframesrc;
        videoWrapper.appendChild(iframe);
        iframe.onload = function() {
          videoWrapper.classList.remove('d-none');
          youtubeIcon.remove();
          previewImage.remove();
        };
      });
    }
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
            if (newVal.videoIdUrl === oldVal.videoIdUrl) {
              element[0].style.opacity = '1';
            }
            else {
              element[0].onload = function() {
                this.style.opacity = '1';
              }
            }
          }
        }
      }, true);
    }
  };
});
