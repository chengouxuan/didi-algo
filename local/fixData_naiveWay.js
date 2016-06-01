var _ = require('underscore');
var csvWrapper = require('./csvWrapper.js');
var fs = require('fs');
var config = require('./config.json');
var time = require('./time.js');
var ut = require('./util.js');
var async = require('async');

if (!config.test) {
  throw new Error('please use test-config file');
}

var path = config.goodData + 'training_naive_way/training_set/';
var testPath = config.goodData + 'training_naive_way/test/';

var main = function () {
  var test = [];
  csvWrapper.parse(config.testReadme, function (e, readme) {
    test.push({
      timeTag: readme['需预测时间片:']
    });
    extendWithDataInDir(testPath, test, function (e, extended) {
      csvWrapper.create(extended, 'test_data.fixed');
    });
  });
  fs.readdir(path, function (e, filenames) {
    _.each(filenames, function (fn) {
      csvWrapper.parse(path + fn, function (e, trainingData) {
        var fixed = fixTrainingData(trainingData);
        var sp = fn.split('.');
        sp[sp.length - 2] += '_fixed';
        fixedFn = sp.join('.');
        csvWrapper.create(fixed, _.last(fixedFn.split('/')));
      });
    });
  });
};

var fixTrainingData = function (trainingData) {
  return trainingData;
};

var parseDir = function (dir, callback) {
  var all = [];
  var path = dir;
  fs.readdir(path, function (e, filenames) {
    if (e) {
      return callback(e);
    }
    var tasks = [];
    _.each(filenames, function (fn) {
      tasks.push(parseFunction (path + fn));
    });
    async.parallel(tasks, function (e, results) {
      if (e) {
        return callback(e);
      }
      _.each(results, function (res) {
        _.each(res, function (r) {
          all.push(r);
        });
      });
      return callback(null, all);
    });
  });
};

var parseFunction = function (path) {
  return function (callback) {
    csvWrapper.parse(path, function (e, data) {
      if (e) {
        return callback(e);
      }
      _.each(data, function (d) {
        var dateStr = ut.dateString(ut.dateInPath(path));
        d.timeTag = dateStr + '-' + d.time;
      });
      return callback(data);
    });
  };
};

var extendWithDataInDir = function (dir, test, callback) {
  parseDir(dir, function (e, all) {
    if (e) {
      console.log(e, all);
      throw new Error('done!');
      return callback(null, test);
    }
    _.each(test, function (t) {
      var date = time.parseTimeTag(t.timeTag).date;
      var time = time.parseTimeTag(t.timeTag).time;
      _.every(all, function (item) {
        if (item.timeTag === t.timeTag) {
          _.extend(t, item);
        }
        return item.timeTag !== t.timeTag;
      });
      return callback(null, test);
    });
  });
};

main();