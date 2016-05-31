var _ = require('underscore');
var csvWrapper = require('./csvWrapper.js');
var config = require('./config.json');
var fs = require('fs');
var dateFormat = require('dateformat');
var ut = require('./util.js');

var dateInPath = ut.dateInPath;

var dateString = function (date) {
  return dateFormat(date, "yyyy-mm-dd");
}

var path = config.goodData + 'timed_weather/';

var main = function () {
  fs.readdir(path, function (e, filenames) {
    if (e) {
      throw e;
    }
    _.each(filenames, function (filename) {
      csvWrapper.parse(path + filename, function (e, data) {
        if (e) {
          throw e;
        }
        var average = _.sortBy(makeAverage(data), function (d) {
          return d.time;
        });
        csvWrapper.create(
          average,
          'timed_weather_avg_' + dateString(dateInPath(filename)),
          'time'
        );
      });
    });
  });
};

var makeAverage = function (data) {
  var ret = [];
  for (var i = 1; i <= 144; ++i) {
    var sum = {
      temp: 0,
      wth: 0,
      pm25: 0,
      count: 0
    };
    _.each(data, function (y, j) {
      if (i === eval(y.time)) {
        sum.temp += eval(y.temperature);
        sum.wth += eval(y.weather);
        sum.pm25 += eval(y.pm25);
        ++sum.count;
      }
    });
    ret.push({
      temperature: sum.temp / sum.count,
      weather: sum.wth / sum.count,
      pm25: sum.pm25 / sum.count,
      averageOf: sum.count,
      time: i
    });
  };
  return _.sortBy(ret, function (t) {
    return eval(t.time);
  });
};

main();
