var fs = require('fs');
var _ = require('underscore');
var config = require('./config.json');

var gObj;

var parseClusterMap = function (callback) {
  if (gObj) {
    return callback(null, gObj);
  }
  var obj = {};
  var str = fs.readFileSync(config.paths.cluster, 'utf-8');
  var lines = str.split('\n');
  _.each(lines, function (line) {
    var values = line.split('\t');
    if (values.length >= 2) {
      obj[values[0]] = values[1];
    }
  });
  callback(null, gObj = obj);
};


var map = {};
parseClusterMap(function (e, obj) {
  map = obj;
});


module.exports = {
  each: function (iteratee, callback) {
    _.each(_.allKeys(map), function (key) {
      iteratee({
        ddHash: key,
        ddId: eval(map[key])
      });
    });
    callback ? callback(e) : 0;
  },
  map: map
}
