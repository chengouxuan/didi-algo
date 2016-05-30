var fs = require('fs');
var _ = require('underscore');
var async = require('async');
var config = require('./config.json');

var parseOrder = function (params, iteratee, callback) {
  var path = (typeof params === 'string') ? params : params.path;
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
          ddId_start: v[3],
          ddId_dest: v[4],
          price: eval(v[5]),
          date: new Date(v[6])
        }, params.filename, params.total, params.curr);
      }
    });
    callback();
  });
};

var parseOrder_all = function (iteratee, callback) {
  var tasks = _.map(config.paths.order, function (path, ind) {
    return parseOrder.bind(null, {
      path: path,
      filename: _.last(path.split('/')),
      total: config.paths.order.length,
      curr: ind
    }, iteratee);
  });
  async.series(tasks, callback);
}

module.exports = {
  each: parseOrder_all,
  parse: parseOrder
};
