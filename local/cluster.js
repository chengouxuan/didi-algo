var fs = require('fs');
var _ = require('underscore');


var parseClusterMap = function (callback) {
  var obj = {};
  fs.readFile('./data/training_data/cluster_map/cluster_map', 'utf-8', function (e, str) {
    var lines = str.split('\n');
    _.each(lines, function (line) {
      var values = line.split('\t');
      if (values.length >= 2) {
        obj[values[0]] = values[1];
      }
    });
    callback(null, obj);
  });
};


module.exports = {
  each: function (iteratee) {
    parseClusterMap(function (e, obj) {
      _.each(_.allKeys(obj), function (key) {
        iteratee({
          ddHash: key,
          ddId: eval(obj[key])
        });
      })
    });
  }
}