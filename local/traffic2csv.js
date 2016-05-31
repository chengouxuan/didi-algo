var _ = require('underscore');
var async = require('async');
var traffic = require('./traffic.js');
var cluster = require('./cluster.js');
var csvWrapper = require('./csvWrapper.js');
var config = require('./config.json');
var time = require('./time.js');
var dateFormat = require('dateformat');
var ut = require('./util.js');

var dateInPath = ut.dateInPath;

var main = function () {
  var map = _.clone(cluster.map);
  var files = config.paths.traffic;
  _.each(files, function (path) {
    var data = [];
    traffic.parse(path, function (tr) {
      data.push({
        area: map[tr.ddHash_cluster],
        time: time.index(tr.date) + 1,
        lv1: tr[1],
        lv2: tr[2],
        lv3: tr[3],
        lv4: tr[4]
      });
    }, function (e) {
      if (e) {
        throw e;
      }
      data = _.sortBy(data, function (d) {
        return eval(d.time);
      });
      data = _.sortBy(data, function (d) {
        return eval(d.area);
      });
      csvWrapper.create(data, 'traffic_' + dateFormat(dateInPath(path), "yyyy-mm-dd"), 'area', 'time');
    });
  }, function (e) {
    console.log(e ? e : 'done with no errors!');
  });
};

main();