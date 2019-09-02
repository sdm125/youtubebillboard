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
