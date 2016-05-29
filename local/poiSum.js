var _ = require('underscore');
var config = require('./config.json');
var csvWrapper = require('./csvWrapper.js');

var main = function () {
  csvWrapper.parse(config.goodData + 'poi.csv', function (e, data) {
    var summed = _.sortBy(sumPoi(data), function (obj) {
      return eval(obj.area);
    });
    csvWrapper.create(summed, 'poi_summed', 'area');
    console.log('done!');
  });
};

var sumPoi = function (data) {
  var summed = [];
  _.each(data, function (item) {
    var added = false;
    _.each(summed, function (summedItem) {
      if (summedItem.area === item.area) {
        summedItem.count += eval(item.count);
        added = true;
      }
    });
    if (!added) {
      summed.push({
        count: eval(item.count),
        area: item.area
      });
    }
  });
  return summed;
};

main();
