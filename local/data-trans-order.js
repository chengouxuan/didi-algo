var fs = require('fs');
var _ = require('underscore');
var order = require('./order.js');
var timeSlot = require('./timeSlot.js');
var cluster = require('./cluster.js');
var ProgressBar = require('progress');

var update = function (obj, ord) {
  ++obj.demand;
  if (ord.ddId_driver !== 'NULL') {
    ++obj.consumed;
  } else {
    ++obj.gap;
  }
  return obj;
};

var main = function () {
  var data = [];
  _.each(timeSlot, function (slot) {
    var d;
    data.push(d = {
      date: slot,
      order_eachCluster: []
    });
    cluster.each(function (c) {
      d.order_eachCluster.push(_.extend({
        asStart: {
          demand: 0,
          consumed: 0,
          gap: 0
        },
        asDest: {
          demand: 0,
          consumed: 0,
          gap: 0
        }
      }, c));
    });
  });
  var bar = new ProgressBar(':bar', { total: 500000 * 21 });
  order.each(function (ord) {
    bar.tick();
    _.each(data, function (d) {
      var slot = d.date;
      if (slot.begin <= ord.date && ord.date <= slot.end) {
        _.each(d.order_eachCluster, function (cl) {
          if (cl.ddHash === ord.ddId_start) {
            cl.asStart = update(cl.asStart, ord);
          } else if (cl.ddHash == ord.ddId_dest) {
            cl.asDest = update(cl.asDest, ord);
          }
        });
      }
    });
  }, function (e) {
    bar.tick(bar.total - bar.curr);
    console.log(data);
  });
}


main();
