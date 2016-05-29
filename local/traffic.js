var fs = require('fs');
var _ = require('underscore');
var async = require('async');

var parseTraffic = function (path, iteratee, callback) {
  fs.readFile(path, 'utf-8', function (e, str) {
    if (e) {
      throw e;
    }
    _.each(str.split('\n'), function (line) {
      var v = line.split('\t');
      if (v.length === 6) {
        iteratee({
          ddHash_cluster: v[0],
          1: eval(v[1].split(':')[1]),
          2: eval(v[2].split(':')[1]),
          3: eval(v[3].split(':')[1]),
          4: eval(v[4].split(':')[1]),
          date: new Date(v[5])
        });
      }
    });
    callback ? callback() : 0;
  });
};

var parseTraffic_all = function (iteratee, callback) {
  var dir = './data/training_data/traffic_data/';
  fs.readdir(dir, function (e, filenames) {
    if (e) {
      throw e;
    }
    filenames = _.filter(filenames, function(filename) {
      return filename.indexOf('traffic_data_') === 0;
    });
    var tasks = _.map(filenames, function (filename) {
      return parseTraffic.bind(null, dir + filename, iteratee);
    });
    async.series(tasks, callback);
  })
}

module.exports = {
  each: parseTraffic_all,
  parse: parseTraffic
};
