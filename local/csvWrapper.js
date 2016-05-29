var fs = require('fs');
var _ = require('underscore');
var csvWriter = require('csv-write-stream');


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


module.exports = {
  create: createCsv
};
