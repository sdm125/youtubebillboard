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

  service.getBillboardMonth = function() {
    return _month;
  }

  service.getBillboardDay = function() {
    return _day;
  }

  service.getBillboardYear = function() {
    return _year;
  }

  return service;
});

app.factory('toggleHelp', function() {
  var service = {};
  var _toggleHelp = false;

  service.toggleHelp = function() {
    _toggleHelp = !_toggleHelp;
  }

  service.getToggleHelp = function() {
    return _toggleHelp;
  }

  return service;
});