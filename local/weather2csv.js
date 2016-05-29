var fs = require('fs');
var _ = require('underscore');
var async = require('async');
var weather = require('./weather.js');
var config = require('./config.json');
var time = require('./time.js');
var csvWriter = require('csv-write-stream');
var dateFormat = require('dateformat');

var dateInPath = function (filename) {
  var sp = filename.split('_');
  return new Date(sp[sp.length - 1]);
};

var main = function () {
  _.each(config.paths.weather, function (path, ind) {
    var begin = dateInPath(path);
    begin.setHours(0, 0, 0, 0);
    var end = new Date(begin.getTime() + 1000 * 60 * 60 * 24);
    var timeSlots = time.gen(begin, end);
    var data = [];
    weather.parse(path, function (wth) {
      _.each(timeSlots, function (slot) {
        if (slot.begin <= wth.date && wth.date <= slot.end) {
          data.push({
            time: slot.index + 1,
            weather: wth.wther,
            temperature: wth.tmpr,
            pm25: wth.pm25
          });
        }
      });
    }, function (e) {
      createCsv(data, 'timed_weather_' + dateFormat(begin, "yyyy-mm-dd"));
    });
  });
};

var createCsv = function (data, filename) {
  console.log('create csv', filename);
  var keys = _.allKeys(data[0]);
  var path = './data-transformed/' + filename + '.csv';
  var writer = csvWriter({ headers: keys });
  writer.pipe(fs.createWriteStream(path));
  _.each(data, function (d) {
    var line = [];
    _.each(keys, function (key) {
      line.push(d[key]);
    });
    writer.write(line);
  });
  writer.end();
};

main();
