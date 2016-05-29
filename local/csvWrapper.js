var fs = require('fs');
var _ = require('underscore');
var csvWriter = require('csv-write-stream');
var csv = require('csv');


var createCsv = function (data, filename) {
  console.log('create csv', filename);
  var keys = _.allKeys(data[0]);
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


var parseCsv = function (filename, callback) {
  console.log('parse csv', filename);
  var rs = fs.createReadStream(config.tempDir + filename);
  var parser = parse({ columns: true }, function (e, data) {
    callback ? callback(e, data) : 0;
  });
  rs.pipe(parser);
};


module.exports = {
  create: createCsv,
  parse: parseCsv
};
