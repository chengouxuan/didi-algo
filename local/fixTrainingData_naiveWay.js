var _ = require('underscore');
var csvWrapper = require('./csvWrapper.js');
var fs = require('fs');
var config = require('./config.json');
var time = require('./time.js');
var ut = require('./util.js');

if (!config.test) {
  throw new Error('please use test-config file');
}

var main = function () {
  var test = [];
  csvWrapper.parse(config.testReadme, function (e, readme) {
    test.push({
      timeTag: readme['需预测时间片:']
    });
    test = extendWithTestData(test);
  });
};

var extendWithTestData = function (test) {
  _.each(test, function (t) {
    var date = time.parseTimeTag(t.timeTag).date;
    var time = time.parseTimeTag(t.timeTag).time;
    var path = config.goodData + 'training_naive_way/training_data_' + ut.dateString(date) + '.csv';
    csvWrapper.parse(path, function (e, data) {
      _.each(data, function (d) {
        if (d.in_time_t0 === time.toString()) {
          
        }
      });
    });
  });
};

main();