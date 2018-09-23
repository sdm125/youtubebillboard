'use strict';

const app = angular.module('youtubeBillboard', ['ngRoute', 'duScroll']);

app.config(($routeProvider, $locationProvider, $sceDelegateProvider) => {
  $routeProvider.when('/:month?/:day?/:year?', {
    templateUrl : 'templates/main.html',
    controller: 'mainCtrl'
  });

  $sceDelegateProvider.resourceUrlWhitelist([
    'self',                    // trust all resources from the same origin
    '*://www.youtube.com/**'   // trust all resources from `www.youtube.com`
  ]);
});
