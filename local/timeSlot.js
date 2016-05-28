var _ = require('underscore');

var exp = module.exports = {
  all: []
};

var all = exp.all;

var generate = function () {
  var inc = 10 * 60 * 1000;
  var date = new Date('2016-01-01 00:00:00');
  var ind = 0;
  while (date < new Date('2016-01-22 00:00:00')) {
    all.push({
      index: ind,
      begin: date,
      end: new Date(date.getTime() + inc)
    });
    ++ind;
    date = new Date(date.getTime() + inc);
  }
};

generate();
