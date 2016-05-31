var dateFormat = require('dateformat');
var _ = require('underscore');

var exp = module.exports = {};

exp.dateString = function (date) {
  return dateFormat(date, "yyyy-mm-dd");
};

exp.filenameInPath = function (path) {
  return _.last(path.split('/'));
};

exp.dateInPath = function (path) {
  var sp = path ? path.split('_') : [];
  var date;
  while (sp && (!date || !date.getTime())) {
    date = new Date(sp[sp.length - 1].split('.')[0]);
    sp = sp.slice(0, sp.length - 1);
  }
  return date;
};
