
var getIndex = function (date) {
  var d = new Date(date);
  d.setMinutes(0);
  d.setHours(0);
  var mod = 10 * 60 * 1000;
  var time = date.getTime();
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

var exp = module.exports = {
  gen: generate,
  index: getIndex
};
