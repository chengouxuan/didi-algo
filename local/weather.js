var fs = require('fs');
var _ = require('underscore');
var async = require('async');

var parseWeather = function (path, iteratee, callback) {
  fs.readFile(path, 'utf-8', function (e, str) {
    if (e) {
      throw e;
    }
    _.each(str.split('\n'), function (line) {
      var v = line.split('\t');
      if (v.length === 4) {
        iteratee({
          date: new Date(v[0]),
          wther: eval(v[1]),
          tmpr: eval(v[2]),
          pm25: eval(v[3]),
        });
      }
    });
    callback();
  });
};

var parseWeather_all = function (iteratee) {
  var dir = './data/training_data/weather_data/';
  fs.readdir(dir, function (e, filenames) {
    if (e) {
      throw e;
    }
    filenames = _.filter(filenames, function(filename) {
      return filename.indexOf('weather_data_') === 0;
    });
    var tasks = _.map(filenames, function (filename) {
      return parseWeather.bind(null, dir + filename, iteratee);
    });
    async.series(tasks, function (e, res) {
      if (e) {
        throw e;
      }
    });
  })
}

module.exports = {
  each: parseWeather_all
};
