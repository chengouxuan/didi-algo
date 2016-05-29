var fs = require('fs');
var _ = require('underscore');
var csvWriter = require('csv-write-stream');
var csv = require('csv');
var config = require('./config.json');

var createCsv = function (data, filename, primKey, primKey2) {
  console.log('create csv', filename);
  var keys = _.allKeys(data[0]);
  if (primKey) {
    var ind = 0;
    var swapInd = -1;
    _.each(keys, function (key, ind) {
      if (key === primKey) {
        swapInd = ind;
      }
    });
    if (swapInd !== -1) {
      var tmp = keys[swapInd];
      keys[swapInd] = keys[ind];
      keys[ind] = tmp;
      ++ind;
    }
  }
  if (primKey2) {
    var swapInd = -1;
    _.each(keys, function (key, ind) {
      if (key === primKey2) {
        swapInd = ind;
      }
    });
    if (swapInd !== -1) {
      var tmp = keys[swapInd];
      keys[swapInd] = keys[ind];
      keys[ind] = tmp;
    }
  }
  var path = config.tempDir + filename + '.csv';
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


var parseCsv = function (path, callback) {
  console.log('parse csv', path);
  var rs = fs.createReadStream(path);
  var parser = csv.parse({ columns: true }, function (e, data) {
    callback ? callback(e, data) : 0;
  });
  rs.pipe(parser);
};


module.exports = {
  create: createCsv,
  parse: parseCsv
};
