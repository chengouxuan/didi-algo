var fs = require('fs');
var _ = require('underscore');
var async = require('async');
var config = require('./config.json');
var time = require('./time.js');
var csvWrapper = require('./csvWrapper.js');
var dateFormat = require('dateformat');

var dateInPath = function (filename) {
  var sp = filename.split('_');
  var date = new Date(sp[sp.length - 1]);
  date.setHours(0, 0, 0, 0);
  return date;
};

var main = function () {
  _.each(config.paths.order, function (path) {
    var date = dateInPath(path);
    
  });
};

main();
