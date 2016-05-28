var fs = require('fs');
var _ = require('underscore');

var parsePoi = function (iteratee, callback) {
  fs.readFile('./data/training_data/poi_data/poi_data', 'utf-8', function (e, str) {
    if (e) {
      throw e;
    }
    var lines = str.split('\n');
    _.each(lines, function (line) {
      if (!line) {
        return;
      }
      var values = line.split('\t');
      var ddHash = values[0];
      _.each(values.slice(1), function (val) {
        var sp = val.split(':');
        var count = sp[1];
        iteratee({
          tag: sp[0],
          count: eval(sp[1]),
          ddHash_cluster: ddHash
        });
      });
    });
    callback ? callback() : 0;
  });
};

module.exports = {
  each: parsePoi
}
