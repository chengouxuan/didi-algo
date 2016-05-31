var _ = require('underscore');
var csvWrapper = require('./csvWrapper.js');
var config = require('./config.json');
var ut = require('./util.js');
var fs = require('fs');
var util = require('util');

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
        csvWrapper.create(td, 'training_data_' + ut.dateString(date));
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
  _.each(data.slice(0, 144), function (oneArea, ind) {
    var outputs = [];
    for (var i = ind; i < data.length; i += 144) {
      outputs.push(data[i]);
    }
    if (outputs.length !== 66) {
      throw new Error('bad data, outputs length must == 66');
    }
    var i = ind;
    var ok = true;
    var inputs = [];
    while (ind >= 3 && --i >= ind - 3) {
      var j = 0;
      var timeDiff = ind - i;
      while (j + i < data.length) {
        var input = data[i + j];
        if (!(eval(input.time) + timeDiff === eval(outputs[0].time) && input.area === outputs[j / 144].area)) {
          // console.log(timeDiff);
          // console.log(input);
          // console.log(outputs[j / 144]);
          ok = false;
          break;
        }
        inputs.push(input);
        j += 144;
      }
    }
    if (ok && inputs.length === 3 * 66) {
      td.push({
        input: inputs,
        output: outputs
      });
      // console.log(td);
    } else {
      // console.log(ok, inputs);
    }
  });
        // console.log(util.inspect(td, { depth: 5 }));
  td = flattenTrainingData(td);
  // td = filterInvalidData(td);
  return td;
};

var flattenTrainingData = function (trainingData) {
  var ret = [];
  _.each(trainingData, function (td) {
    var obj = {};
    _.each(td.output, function (o) {
      _.each(o, function (oo) {
        obj['out_a' + o.area] = o.gap;
      });
    });
    _.each(td.input, function (inp, inputInd) {
      _.each(_.allKeys(_.omit(inp, ['gapRate', 'timeSpan', 'area'])), function (key) {
        obj['in_' + key + '_t' + inputInd + '_a' + inp.area] = inp[key];
      });
    });
    ret.push(obj);
  });
  return ret;
};

var filterInvalidData = function (trainingData) {
  // return trainingData;
  var keys = [];
  _.each(trainingData, function (td) {
    keys = keys.concat(_.allKeys(td));
    keys = _.uniq(keys);
  });
  trainingData = _.filter(trainingData, function (td) {
    var valid = true;
    _.each(keys, function (k) {
      var v = td[k];
      valid = valid && (!!v && v !== 'NaN' && v !== '');
    });
    return valid;
  });
  return trainingData;
};


main();

