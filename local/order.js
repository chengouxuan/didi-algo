var fs = require('fs');
var _ = require('underscore');
var async = require('async');

var parseOrder = function (path, iteratee, callback) {
  fs.readFile(path, 'utf-8', function (e, str) {
    if (e) {
      throw e;
    }
    _.each(str.split('\n'), function (line) {
      var v = line.split('\t');
      if (v.length === 7) {
        iteratee({
          ddId_order: v[0],
          ddId_driver: v[1],
          ddId_passenger: v[2],
          ddId_clusterStart: v[3],
          ddId_clusterDest: v[4],
          price: eval(v[5]),
          date: new Date(v[6])
        });
      }
    });
    callback();
  });
};

var parseOrder_all = function (iteratee, callback) {
  var dir = './data/training_data/order_data/';
  fs.readdir(dir, function (e, filenames) {
    if (e) {
      throw e;
    }
    filenames = _.filter(filenames, function(filename) {
      return filename.indexOf('order_data_') === 0;
    });
    var tasks = _.map(filenames, function (filename) {
      return parseOrder.bind(null, dir + filename, iteratee);
    });
    async.series(tasks, callback);
  })
}

module.exports = {
  each: parseOrder_all
};
