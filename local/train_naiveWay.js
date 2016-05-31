var config = require('./config.json');
var _ = require('underscore');
var csvWrapper = require('./csvWrapper.js');
var brain = require('brain');
var fs = require('fs');
var async = require('async');

var main = function () {
  var path = config.goodData + 'training_naive_way/';
  var testPath = config.goodData + 'test/';
  var net = new brain.NeuralNetwork();
  fs.resddir(path, function (e, filenames) {
    if (e) {
      throw e;
    }
    var tasks = [];
    _.each(filenames, function (filename) {
      tasks.push(trainFunction(brain, path + filename));
    });
    async.parallel(tasks, function (e) {
      if (e) {
        throw e;
      }
      fs.readdir(testPath, function (e, filenames) {
        if (e) {
          throw e;
        }
        var tasks = [];
        _.each(filenames, function (filename) {
          tasks.push(runFunction(brain, testPath + filename));
        });
        async.parallel(tasks, function (e, outputs) {
          if (e) {
            throw e;
          }
          createCsv(outputs);
        });
      });
    });
  });
};

var createCsv = function (outputs) {
  _.each(outputs, function (op) {
    csvWrapper.create(op, 'test_result_' + op.timeTag);
  });
};

var runFunction = function (brain, path) {
  return function (callback) {
    csvWrapper.parse(path, function (e, testData) {
      if (e) {
        throw e;
      }
      _.each(testData, function (td) {
        var notInKeys = _.filter(_.allKeys(td), function (k) {
          return _.indexOf(k, 'in_') !== 0;
        });
        var out = net.run(_.omit(td, notInKeys));
        outputs.push(_.extend(td, out));
      });
      callback(null, outputs);
    });
  };
};

var trainFunction = function (brain, path) {
  return function (callback) {
    csvWrapper.parse(path, function (e, data) {
      if (e) {
        throw e;
      }
      _.each(data, function (d) {
        var notInKeys = _.filter(_.allKeys(td), function (k) {
          return _.indexOf(k, 'in_') !== 0;
        });
        var notOutKeys = _.filter(_.allKeys(td), function (k) {
          return _.indexOf(k, 'out_') !== 0;
        });
        net.train({
          input: _.omit(d, noInKeys),
          output: _.omit(d, notOutKeys)
        });
      });
      callback();
    });
  };
};

var makeResultData = function (data) {
  var ret = [];
  _.each(data, function (d) {
    ret.push(d.input.concat(d.output))
  });
};

main();

