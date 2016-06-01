var _ = require('underscore');
var csvWrapper = require('./csvWrapper.js');
var config = require('./config.json');
var ut = require('./util.js');
var fs = require('fs');
var util = require('util');

var main = function () {
  _.each(trainingData, function (td) {
    _.each(td, function (val, key) {
      if (val === 'NaN') {
        td[key] = 0;
      }
    });
  });
};

main();
