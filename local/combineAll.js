var fs = require('fs');
var _ = require('underscore');
var async = require('async');
var config = require('./config.json');
var time = require('./time.js');
var csvWrapper = require('./csvWrapper.js');
var dateFormat = require('dateformat');
var cluster = require('./cluster.js');
var ProgressBar = require('progress');
var ut = require('./util.js');

var dateInPath = ut.dateInPath;

var dateString = function (date) {
  return dateFormat(date, "yyyy-mm-dd");
};

var timeSpanString = function (begin, end) {
  return dateFormat(begin, "HH:MM:ss") + '==>' + dateFormat(end, "HH:MM:ss");
};

var createSlots = function (date) {
  var begin = new Date(date);
  begin.setHours(0, 0, 0, 0);
  var end = new Date(begin);
  end.setHours(24, 0, 0, 0);
  var timeSlots = time.gen(begin, end);
  var ret = [];
  _.each(timeSlots, function (timeSlot) {
    cluster.each(function (cl) {
      ret.push({
        time: (timeSlot.index + 1).toString(),
        area: cl.ddId.toString(),
        timeSpan: timeSpanString(timeSlot.begin, timeSlot.end)
      });
    });
  });
  ret = _.flatten(ret);
  ret = _.sortBy(ret, function (t) {
    return eval(t.time);
  });
  ret = _.sortBy(ret, function (t) {
    return eval(t.area);
  });
  return ret;
};

var updatePoi = function (slots, callback) {
  csvWrapper.parse(config.goodData + 'poi_summed.csv', function (e, data) {
    if (e) {
      return callback(e);
    }
    _.each(data, function (d) {
      _.each(slots, function (slot) {
        if (d.area === slot.area) {
          slot.poiCount = d.count;
        }
      });
    });
    return callback(null);
  });
};

var updateWeather = function (slots, date, callback) {
  var path = config.goodData + 'timed_weather/timed_weather_' + dateString(date) + '.csv';
  csvWrapper.parse(path, function (e, data) {
    if (e) {
      return callback(e);
    }
    _.each(data, function (d) {
      _.each(slots, function (slot) {
        if (d.time === slot.time) {
          slot.weather = d.weather;
          slot.temperature = d.temperature;
          slot.pm25 = d.pm25;
        }
      });
    });
    return callback(null);
  });
};

var updateTraffic = function (slots, date, callback) {
  var path = config.goodData + 'timed_cluster_traffic/traffic_' + dateString(date) + '.csv';
  csvWrapper.parse(path, function (e, data) {
    if (e) {
      return callback(e);
    }
    _.each(data, function (d) {
      _.each(slots, function (slot) {
        if (d.time === slot.time && d.area === slot.area) {
          slot.lv1 = d.lv1;
          slot.lv2 = d.lv2;
          slot.lv3 = d.lv3;
          slot.lv4 = d.lv4;
        }
      });
    });
    return callback(null);
  });
};

var updateOrder = function (slots, date, callback) {
  var path = config.goodData + 'timed_cluster_order/order_data_' + dateString(date) + (config.test ? '_test.csv' : '.csv');
  csvWrapper.parse(path, function (e, data) {
    if (e) {
      return callback(e);
    }
    _.each(data, function (d) {
      _.each(slots, function (slot) {
        if (d.time === slot.time && d.area === slot.area) {
          slot.totalOrders = d.total;
          slot.gap = d.gap;
          slot.gapRate = d.gapRate;
          slot.ordersAsDest = d.total_dest;
        }
      });
    });
    return callback(null);
  })
};

var main = function () {
  var bar = new ProgressBar(':bar', { total: config.paths.order.length });
  _.each(config.paths.order, function (path) {
    var date = dateInPath(path);
    var slots = createSlots(date);
    async.parallel([
      updatePoi.bind(null, slots),
      updateWeather.bind(null, slots, date),
      updateTraffic.bind(null, slots, date),
      updateOrder.bind(null, slots, date)
    ], function (e, res) {
      if (e) {
        throw e;
      }
      csvWrapper.create(slots, 'combined_' + dateString(date), 'area', 'time');
      bar.tick();
    });
  });
};

main();
