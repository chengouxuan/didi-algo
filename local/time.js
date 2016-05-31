var _ = require('underscore');


var getIndex = function (date) {
  var d = new Date(date);
  d.setHours(0, 0, 0, 0);
  var mod = 10 * 60 * 1000;
  var time = date.getTime() - d.getTime();
  return (time - time % mod) / mod;
};

var generate = function (begin, end) {
  var inc = 10 * 60 * 1000;
  var date = new Date(begin);
  var ind = 0;
  var ret = [];
  while (date < end) {
    ret.push({
      index: ind,
      begin: date,
      end: new Date(date.getTime() + inc)
    });
    ++ind;
    date = new Date(date.getTime() + inc);
  }
  return ret;
};

var parseTimeTag = function (timeTag) {
  var sp = timeTag.split('-');
  var date = new Date(sp.slice(0, 3).join('-'));
  var index = eval(_.last(sp)) - 1;
  date.setHours(0, 0, 0, 0);
  date.setTime(date.getTime() + (index + 0.5) * 10 * 60 * 1000);
  return {
    date: date,
    time: index + 1,
    index: index
  };
}

var exp = module.exports = {
  gen: generate,
  index: getIndex
};
