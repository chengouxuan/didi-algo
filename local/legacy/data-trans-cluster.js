var fs = require('fs');
var AV = require('./lean.js');
var _ = require('underscore');
var Cluster = require('./av-class/cluster');

var main = function () {
  
  parseClusterMap(function (e, obj) {
    if (e) {
      throw e;
    }
    var p = [];
    _.each(_.allKeys(obj), function (key) {
      console.log('setting ' + key + ', ' + obj[key]);
      p.push(new Cluster({
        ddHash: key,
        ddId: eval(obj[key])
      }).save());
    });
    AV.Promise.when(p).then(function () {
      console.log('done');
    });
  });
};

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

main();
