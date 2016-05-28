var t = require('./traffic.js');
var Traffic = require('./av-class/traffic.js');
var async = require('async');
require('./lean.js');

var tasks = [];
t.each(function (obj) {
  console.log(obj);
  tasks.push(function (callback) {
    console.log('inserting', obj);
    new Traffic(obj)
      .save()
    .then(function () {
      callback();
    }, function (e) {
      callback(e);
    });
  });
}, function (e) {
  if (e) {
    throw e;
  } else {
    console.log('done reading with no errors');
  }
  async.parallelLimit(tasks, 10, function (e, res) {
    console.log(e ? e : 'no errors');
  });
});
