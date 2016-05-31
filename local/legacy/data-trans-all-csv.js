var fs = require('fs');
var _ = require('underscore');
var util = require('util');
var async = require('async');

var ProgressBar = require('progress');
var csvWriter = require('csv-write-stream');

var order = require('./order.js');
var timeSlot = require('./timeSlot.js').all;
var cluster = require('./cluster.js');
var poi = require('./poi.js');
var weather = require('./weather.js');
var traffic = require('./traffic.js');


var config = {
  paths: {
    order: './data/training_data/order_data/',
    weather: './data/training_data/weather_data/',
    poi: './data/training_data/poi_data/',
    cluster: './data/training_data/cluster_map/',
    traffic: './data/training_data/traffic_data/'
  },
  days: [
    '2016-01-01',
/*    '2016-01-02',
    '2016-01-03',
    '2016-01-04',
    '2016-01-05',
    '2016-01-06',
    '2016-01-07',
    '2016-01-08',
    '2016-01-09',
    '2016-01-10',
    '2016-01-11',
    '2016-01-12',
    '2016-01-13',
    '2016-01-14',
    '2016-01-15',
    '2016-01-16',
    '2016-01-17',
    '2016-01-18',
    '2016-01-19',
    '2016-01-20',
    '2016-01-21'
 */ ]
};

var updateGapStats = function (obj, ord) {
  ++obj.demand;
  if (ord.ddId_driver !== 'NULL') {
    ++obj.consumed;
  } else {
    ++obj.gap;
  }
  return obj;
};

var eachDataSlot = function (data, iteratee) {
  _.each(data, function (d, i) {
    _.each(d.data_eachCluster, function (cl, j) {
      iteratee({
        date: d.date,
        row: i,
        column: j
      }, cl);
    });
  });
};

var updateWithWeather = function (data, wth) {
  eachDataSlot(data, function (params, slot) {
    if (params.date.begin <= wth.date && wth.date <= params.date.end) {
      if (slot.weather) {
        console.log('duplicated weather data in some slot, old', slot.weather, 'new', wth, 'overriding...');
      }
      slot.weather = _.clone(wth);
    }
  });
};

var updateWithPoi = function (data, poi) {
  eachDataSlot(data, function (params, slot) {
    if (slot.ddHash === poi.ddHash_cluster) {
      slot.poiCount += poi.count;
    }
  });
};

var updateWithOrder = function (data, ord) {
  eachDataSlot(data, function (params, slot) {
    if (params.date.begin <= ord.date && ord.date <= params.date.end) {
      if (slot.ddHash === ord.ddId_start) {
        slot.asStart = updateGapStats(slot.asStart, ord);
        //console.log('updated', slot);
      } else if (slot.ddHash == ord.ddId_dest) {
        slot.asDest = updateGapStats(slot.asDest, ord);
        //console.log('updated', slot);
      }
    }
  });
};

var updateWithTraffic = function (data, tr) {
  eachDataSlot(data, function (params, slot) {
    if (params.date.begin <= tr.date && tr.date <= params.date.end) {
      if (slot.ddHash === tr.ddHash_cluster) {
        if (slot.traffic) {
          console.log('duplicated traffic date in some slot, old', slot.traffic, 'new', tr, 'overriding...');
        }
        slot.traffic = _.clone(tr);
      }
    }
  });
};

var createDataSlots = function (date) {
  var data = [];
  _.each(timeSlot, function (slot) {
    if (slot.begin.getDate() !== date.getDate() ||
        slot.begin.getFullYear() !== date.getFullYear()) {
      return;
    }
    var d;
    data.push(d = {
      date: slot,
      data_eachCluster: []
    });
    cluster.each(function (c) {
      d.data_eachCluster.push(_.extend({
        asStart: {
          demand: 0,
          consumed: 0,
          gap: 0
        },
        asDest: {
          demand: 0,
          consumed: 0,
          gap: 0
        },
        poiCount: 0,
      }, c));
    });
  });
  return data;
};

var createCsv = function (params) {
  console.log('create csv', params.filename);
  var path = 'data-transformed/' + params.filename + '.csv';
  var writer = csvWriter({ headers: ['time', 'begin', 'end', 'area', 'total', 'gap', 'gapRate', 'total_dest']});
  writer.pipe(fs.createWriteStream(path));
  eachDataSlot(params.data, function (params, slot) {
    var date = params.date;
    writer.write([
      date.index % 144 + 1,
      date.begin,
      date.end,
      slot.ddId,
      slot.asStart.demand,
      slot.asStart.gap,
      slot.asStart.gap / slot.asStart.demand,
      slot.asDest.demand
    ]);
  });
  writer.end();
};

var dateOfFilename = function (filename) {
  var sp = filename ? filename.split('order_data_') : [];
  var date = sp ? new Date(sp[sp.length - 1]) : 0;
  return date;
};

var main = function () {
  var bar = new ProgressBar(':bar', { total: config.days.length });

  var tasks = [];

  var task = function (day, callback) {
    var date = new Date(day);
    var data = createDataSlots(date);
    poi.each(function (p) {
      updateWithPoi(data, p);
    });
    order.parse(config.paths.order + 'order_data_' + day, function (ord) {
      updateWithOrder(data, ord);
    });
    console.log(util.inspect(data, {depth: 5}));
    weather.parse(config.paths.weather + 'weather_data_' + day, function (wth) {
      updateWithWeather(data, wth);
    });
    traffic.parse(config.paths.traffic + 'traffic_data_' + day, function (tr) {
      updateWithTraffic(data, tr);
    });
    //console.log('done updating data', util.inspect(data, {depth: 5}));
    createCsv({
      filename: 'all_' + day,
      data: data
    });
    bar.tick();
    callback();
  };

  _.each(config.days, function (day) {
    tasks.push(task.bind(null, day));
  });

  async.series(tasks, function (e) {
    console.log(e ? e : 'done with no errors!');
  });
};


main();

