var dateFormat = require('dateformat');

var exp = module.exports = {};

exp.dateInPath = function (filename) {
  var sp = filename.split('_');
  sp = sp[sp.length - 1].split('.');
  return new Date(sp[0]);
};

exp.dateString = function (date) {
  return dateFormat(date, "yyyy-mm-dd");
};

