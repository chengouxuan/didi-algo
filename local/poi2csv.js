var fs = require('fs');
var _ = require('underscore');
var async = require('async');
var poi = require('./poi.js');
var cluster = require('./cluster.js');
var csvWrapper = require('./csvWrapper.js');

var dateInPath = function (filename) {
  var sp = filename.split('_');
  return new Date(sp[sp.length - 1]);
};

var main = function () {
  var data = [];
  var map = {};
  cluster.each(function (cl) {
    map[cl.ddHash] = cl.ddId;
  });
  poi.each(function (poi) {
    data.push({
      area: map[poi.ddHash_cluster],
      tag: poi.tag,
      count: poi.count
    });
  }, function (e) {
    if (e) {
      throw e;
    }
    data = _.sortBy(data, function (d) {
      return d.area;
    });
    csvWrapper.create(data, 'poi');
  });
};

main();
