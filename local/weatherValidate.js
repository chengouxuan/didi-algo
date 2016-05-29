var config = require('./config.json');
var csvWrapper = require('./csvWrapper.js');
var fs = require('fs');
var _ = require('underscore');

var weatherDir = config.goodData + 'timed_weather/';

var main = function () {
  fs.readdir(weatherDir, function (e, filenames) {
    if (e) {
      throw e;
    }
    _.each(filenames, function (filename) {
      csvWrapper.parse(weatherDir + filename, function (e, data) {
        if (e) {
          throw e;
        }
        validate(data);
      });
    });
  });
};

var validate = function (data) {
  _.each(data, function (x) {
    _.each(data, function (y) {
      if (x.time === y.time) {
      // console.log('validating...', x, y);
        if (x.weather !== y.weather) {
          console.log('difference', x, y, x.weather - y.weather);
        }
      }
    })
  });
};

main();
