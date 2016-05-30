var _ = require('underscore');
var csvWrapper = require('./csvWrapper.js');
var config = require('./config.json');
var ut = require('./util.js');
var fs = require('fs');

var path = config.goodData + 'combined/';

var main = function () {
  fs.readdir(path, function (e, filenames) {
    if (e) {
      throw e;
    }
    _.each(filenames, function (filename) {
      csvWrapper.parse(path + filename, function (e, data) {
        var td = makeTrainingData(data);
        var date = ut.dateInPath(filename);
        csvWrapper.create(td, 'trainintData_' + ut.dateString(date), 'out', 'in_time');
      });
    });
  });
};


var makeTrainingData = function (data) {
  data = _.sortBy(_.clone(data), function (d) {
    return eval(d.time);
  });
  data = _.sortBy(_.clone(data), function (d) {
    return eval(d.area);
  });
  var td = [];
  _.each(data, function (output, ind) {
    var i = ind;
    var ok = true;
    var inputs = [];
    while (ind >= 3 && --i >= ind - 3) {
      var input = data[i];
      if (!(eval(input.time) < eval(output.time) && input.area === output.area)) {
        ok = false;
        break;
      }
      inputs.push(input);
    }
    if (ok && inputs.length === 3) {
      td.push({
        input: inputs,
        output: output
      });
      // console.log(td);
    } else {
      // console.log(ok);
    }
  });
  td = flattenTrainingData(td);
  td = filterInvalidData(td);
  return td;
};

var flattenTrainingData = function (trainintData) {
  var ret = [];
  _.each(trainintData, function (td) {
    var obj = {};
    _.each(td.input, function (inp, inputInd) {
      _.each(_.allKeys(_.omit(inp, ['gapRate', 'timeSpan', 'time', 'poiCount'])), function (key) {
        obj['in_' + key + '_' + inputInd] = inp[key];
      });
      obj.out = td.output.gap;
      obj.in_time = td.output.time;
      obj.in_poiCount = td.output.poiCount;
    });
    ret.push(obj);
  });
  return ret;
};

var filterInvalidData = function (trainintData) {
  // return trainintData;
  var keys = [];
  _.each(trainintData, function (td) {
    keys = keys.concat(_.allKeys(td));
    keys = _.uniq(keys);
  });
  trainintData = _.filter(trainintData, function (td) {
    var valid = true;
    _.each(keys, function (k) {
      var v = td[k];
      valid = valid && (!!v && v !== 'NaN' && v !== '');
    });
    return valid;
  });
  return trainintData;
};


main();

