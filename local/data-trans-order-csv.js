var fs = require('fs');
var _ = require('underscore');
var order = require('./order.js');
var timeSlot = require('./timeSlot.js').all;
var cluster = require('./cluster.js');
var ProgressBar = require('progress');
var csvWriter = require('csv-write-stream');
var util = require('util');

var update = function (obj, ord) {
  ++obj.demand;
  if (ord.ddId_driver !== 'NULL') {
    ++obj.consumed;
  } else {
    ++obj.gap;
  }
  return obj;
};

var findAndUpdate = function (data, ord) {
  // console.log('find and update', util.inspect(data, {depth: 5}), ord);
  _.each(data, function (d) {
    var slot = d.date;
    if (slot.begin <= ord.date && ord.date <= slot.end) {
      _.each(d.order_eachCluster, function (cl) {
        if (cl.ddHash === ord.ddId_start) {
          cl.asStart = update(cl.asStart, ord);
          // console.log('updated', cl);
        } else if (cl.ddHash == ord.ddId_dest) {
          cl.asDest = update(cl.asDest, ord);
          // console.log('updated', cl);
        }
      });
    }
  });
}

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
  return data;
};

var createCsv = function (params) {
  console.log('create csv', params.filename);
  var path = 'data-transformed/' + params.filename + '.csv';
  var writer = csvWriter({ headers: ['time', 'begin', 'end', 'area', 'total', 'gap', 'gapRate', 'total_dest']});
  writer.pipe(fs.createWriteStream(path));
  _.each(params.data, function (timeSlot) {
    _.each(timeSlot.order_eachCluster, function (d) {
      writer.write([
        timeSlot.date.index % 144 + 1,
        timeSlot.date.begin,
        timeSlot.date.end,
        d.ddId,
        d.asStart.demand,
        d.asStart.gap,
        d.asStart.gap / d.asStart.demand,
        d.asDest.demand
      ]);
    });
  });
  writer.end();
};

var dateOfFilename = function (filename) {
  var sp = filename ? filename.split('order_data_') : [];
  var date = sp ? new Date(sp[sp.length - 1]) : 0;
  return date;
};

var main = function () {
  var data;
  var bar;
  var tick;
  var lastFilename;
  order.each(function (ord, filename, total, curr) {
    if (!bar) {
      console.log('processing file', filename);
      bar = new ProgressBar(':bar', { total: total });
      tick = curr;
      bar.tick();
      lastFilename = filename;
      data = createDataSlots(dateOfFilename(filename));
    } else {
      if (curr !== tick) {
        console.log('processing file', filename);
        createCsv({
          filename: lastFilename,
          data: data
        });
        data = createDataSlots(dateOfFilename(filename));
        tick = curr;
        bar.tick();
        lastFilename = filename;
      }
    }
    findAndUpdate(data, ord);
  }, function (e) {
    if (e) {
      throw e;
    }
    createCsv({
      filename: lastFilename,
      data: data
    });
  });
}


main();
