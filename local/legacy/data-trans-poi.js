var fs = require('fs');
var AV = require('./lean.js');
var _ = require('underscore');
var Cluster = require('./av-class/cluster');
var Poi = require('./av-class/poi');
var should = require('should');

var main = function () {
  
  parsePoi(function (e, obj) {
    if (e) {
      throw e;
    }
    console.log(obj);
  });
};

var parsePoi = function (callback) {
  var arr = []
  fs.readFile('./data/training_data/poi_data/poi_data', 'utf-8', function (e, str) {
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
        arr.push({
          tag: sp[0],
          count: eval(sp[1]),
          ddHash_cluster: ddHash
        });
      });
    });
    callback(null, obj);
  });
};

main();

