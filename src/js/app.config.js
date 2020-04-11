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
