var fs = require('fs');
var csvWriter = require('csv-write-stream');
var async = require('async');
var AV = require('./lean.js');

var filePath = 'data-transformed/main.csv';

var beginTrans = function (force, callback) {
  if (fs.existsSync(filePath) && !force) {
    console.log(filePath + ' exists, using old file');
    return callback(null, filePath);
  }
  
  var writer = csvWriter({ headers: ['time', 'area', 'gap', 'total', 'gapPercent']});
  writer.pipe(fs.createWriteStream(filePath));
  
  async.parallel([
    parseClusterMap,
    parsePoiData,
    parseTrafficData,
    parseWeatherData
  ], function () {
    return callback(null, filePath);
  });
};

module.exports = {
  filePath: filePath，
  beginTrans: beginTrans
};

