var _ = require('underscore');
var csvWrapper = require('./csvWrapper.js');
var config = require('./config.json');
var ut = require('./util.js');
var fs = require('fs');
var util = require('util');

var path = config.goodData + 'combined/';

var omitKeys = [
  'in_time_t1_a2',
  'in_time_t1_a3',
  'in_time_t1_a4',
  'in_time_t1_a5',
  'in_time_t1_a6',
  'in_time_t1_a7',
  'in_time_t1_a8',
  'in_time_t1_a9',
  'in_time_t1_a10',
  'in_time_t1_a11',
  'in_time_t1_a12',
  'in_time_t1_a13',
  'in_time_t1_a14',
  'in_time_t1_a15',
  'in_time_t1_a16',
  'in_time_t1_a17',
  'in_time_t1_a18',
  'in_time_t1_a19',
  'in_time_t1_a20',
  'in_time_t1_a21',
  'in_time_t1_a22',
  'in_time_t1_a23',
  'in_time_t1_a24',
  'in_time_t1_a25',
  'in_time_t1_a26',
  'in_time_t1_a27',
  'in_time_t1_a28',
  'in_time_t1_a29',
  'in_time_t1_a30',
  'in_time_t1_a31',
  'in_time_t1_a32',
  'in_time_t1_a33',
  'in_time_t1_a34',
  'in_time_t1_a35',
  'in_time_t1_a36',
  'in_time_t1_a37',
  'in_time_t1_a38',
  'in_time_t1_a19',
  'in_time_t1_a40',
  'in_time_t1_a41',
  'in_time_t1_a42',
  'in_time_t1_a43',
  'in_time_t1_a44',
  'in_time_t1_a45',
  'in_time_t1_a46',
  'in_time_t1_a47',
  'in_time_t1_a48',
  'in_time_t1_a49',
  'in_time_t1_a50',
  'in_time_t1_a51',
  'in_time_t1_a52',
  'in_time_t1_a53',
  'in_time_t1_a54',
  'in_time_t1_a55',
  'in_time_t1_a56',
  'in_time_t1_a57',
  'in_time_t1_a58',
  'in_time_t1_a59',
  'in_time_t1_a60',
  'in_time_t1_a61',
  'in_time_t1_a62',
  'in_time_t1_a63',
  'in_time_t1_a64',
  'in_time_t1_a65',
  'in_time_t1_a66',
  
  'in_time_t2_a2',
  'in_time_t2_a3',
  'in_time_t2_a4',
  'in_time_t2_a5',
  'in_time_t2_a6',
  'in_time_t2_a7',
  'in_time_t2_a8',
  'in_time_t2_a9',
  'in_time_t2_a10',
  'in_time_t2_a11',
  'in_time_t2_a12',
  'in_time_t2_a13',
  'in_time_t2_a14',
  'in_time_t2_a15',
  'in_time_t2_a16',
  'in_time_t2_a17',
  'in_time_t2_a18',
  'in_time_t2_a19',
  'in_time_t2_a20',
  'in_time_t2_a21',
  'in_time_t2_a22',
  'in_time_t2_a23',
  'in_time_t2_a24',
  'in_time_t2_a25',
  'in_time_t2_a26',
  'in_time_t2_a27',
  'in_time_t2_a28',
  'in_time_t2_a29',
  'in_time_t2_a30',
  'in_time_t2_a31',
  'in_time_t2_a32',
  'in_time_t2_a33',
  'in_time_t2_a34',
  'in_time_t2_a35',
  'in_time_t2_a36',
  'in_time_t2_a37',
  'in_time_t2_a38',
  'in_time_t2_a19',
  'in_time_t2_a40',
  'in_time_t2_a41',
  'in_time_t2_a42',
  'in_time_t2_a43',
  'in_time_t2_a44',
  'in_time_t2_a45',
  'in_time_t2_a46',
  'in_time_t2_a47',
  'in_time_t2_a48',
  'in_time_t2_a49',
  'in_time_t2_a50',
  'in_time_t2_a51',
  'in_time_t2_a52',
  'in_time_t2_a53',
  'in_time_t2_a54',
  'in_time_t2_a55',
  'in_time_t2_a56',
  'in_time_t2_a57',
  'in_time_t2_a58',
  'in_time_t2_a59',
  'in_time_t2_a60',
  'in_time_t2_a61',
  'in_time_t2_a62',
  'in_time_t2_a63',
  'in_time_t2_a64',
  'in_time_t2_a65',
  'in_time_t2_a66',
  
  'in_time_t3_a2',
  'in_time_t3_a3',
  'in_time_t3_a4',
  'in_time_t3_a5',
  'in_time_t3_a6',
  'in_time_t3_a7',
  'in_time_t3_a8',
  'in_time_t3_a9',
  'in_time_t3_a10',
  'in_time_t3_a11',
  'in_time_t3_a12',
  'in_time_t3_a13',
  'in_time_t3_a14',
  'in_time_t3_a15',
  'in_time_t3_a16',
  'in_time_t3_a17',
  'in_time_t3_a18',
  'in_time_t3_a19',
  'in_time_t3_a20',
  'in_time_t3_a21',
  'in_time_t3_a22',
  'in_time_t3_a23',
  'in_time_t3_a24',
  'in_time_t3_a25',
  'in_time_t3_a26',
  'in_time_t3_a27',
  'in_time_t3_a28',
  'in_time_t3_a29',
  'in_time_t3_a30',
  'in_time_t3_a31',
  'in_time_t3_a32',
  'in_time_t3_a33',
  'in_time_t3_a34',
  'in_time_t3_a35',
  'in_time_t3_a36',
  'in_time_t3_a37',
  'in_time_t3_a38',
  'in_time_t3_a19',
  'in_time_t3_a40',
  'in_time_t3_a41',
  'in_time_t3_a42',
  'in_time_t3_a43',
  'in_time_t3_a44',
  'in_time_t3_a45',
  'in_time_t3_a46',
  'in_time_t3_a47',
  'in_time_t3_a48',
  'in_time_t3_a49',
  'in_time_t3_a50',
  'in_time_t3_a51',
  'in_time_t3_a52',
  'in_time_t3_a53',
  'in_time_t3_a54',
  'in_time_t3_a55',
  'in_time_t3_a56',
  'in_time_t3_a57',
  'in_time_t3_a58',
  'in_time_t3_a59',
  'in_time_t3_a60',
  'in_time_t3_a61',
  'in_time_t3_a62',
  'in_time_t3_a63',
  'in_time_t3_a64',
  'in_time_t3_a65',
  'in_time_t3_a66',

  'in_weather_t1_a2',
  'in_weather_t1_a3',
  'in_weather_t1_a4',
  'in_weather_t1_a5',
  'in_weather_t1_a6',
  'in_weather_t1_a7',
  'in_weather_t1_a8',
  'in_weather_t1_a9',
  'in_weather_t1_a10',
  'in_weather_t1_a11',
  'in_weather_t1_a12',
  'in_weather_t1_a13',
  'in_weather_t1_a14',
  'in_weather_t1_a15',
  'in_weather_t1_a16',
  'in_weather_t1_a17',
  'in_weather_t1_a18',
  'in_weather_t1_a19',
  'in_weather_t1_a20',
  'in_weather_t1_a21',
  'in_weather_t1_a22',
  'in_weather_t1_a23',
  'in_weather_t1_a24',
  'in_weather_t1_a25',
  'in_weather_t1_a26',
  'in_weather_t1_a27',
  'in_weather_t1_a28',
  'in_weather_t1_a29',
  'in_weather_t1_a30',
  'in_weather_t1_a31',
  'in_weather_t1_a32',
  'in_weather_t1_a33',
  'in_weather_t1_a34',
  'in_weather_t1_a35',
  'in_weather_t1_a36',
  'in_weather_t1_a37',
  'in_weather_t1_a38',
  'in_weather_t1_a19',
  'in_weather_t1_a40',
  'in_weather_t1_a41',
  'in_weather_t1_a42',
  'in_weather_t1_a43',
  'in_weather_t1_a44',
  'in_weather_t1_a45',
  'in_weather_t1_a46',
  'in_weather_t1_a47',
  'in_weather_t1_a48',
  'in_weather_t1_a49',
  'in_weather_t1_a50',
  'in_weather_t1_a51',
  'in_weather_t1_a52',
  'in_weather_t1_a53',
  'in_weather_t1_a54',
  'in_weather_t1_a55',
  'in_weather_t1_a56',
  'in_weather_t1_a57',
  'in_weather_t1_a58',
  'in_weather_t1_a59',
  'in_weather_t1_a60',
  'in_weather_t1_a61',
  'in_weather_t1_a62',
  'in_weather_t1_a63',
  'in_weather_t1_a64',
  'in_weather_t1_a65',
  'in_weather_t1_a66',
  
  'in_weather_t2_a2',
  'in_weather_t2_a3',
  'in_weather_t2_a4',
  'in_weather_t2_a5',
  'in_weather_t2_a6',
  'in_weather_t2_a7',
  'in_weather_t2_a8',
  'in_weather_t2_a9',
  'in_weather_t2_a10',
  'in_weather_t2_a11',
  'in_weather_t2_a12',
  'in_weather_t2_a13',
  'in_weather_t2_a14',
  'in_weather_t2_a15',
  'in_weather_t2_a16',
  'in_weather_t2_a17',
  'in_weather_t2_a18',
  'in_weather_t2_a19',
  'in_weather_t2_a20',
  'in_weather_t2_a21',
  'in_weather_t2_a22',
  'in_weather_t2_a23',
  'in_weather_t2_a24',
  'in_weather_t2_a25',
  'in_weather_t2_a26',
  'in_weather_t2_a27',
  'in_weather_t2_a28',
  'in_weather_t2_a29',
  'in_weather_t2_a30',
  'in_weather_t2_a31',
  'in_weather_t2_a32',
  'in_weather_t2_a33',
  'in_weather_t2_a34',
  'in_weather_t2_a35',
  'in_weather_t2_a36',
  'in_weather_t2_a37',
  'in_weather_t2_a38',
  'in_weather_t2_a19',
  'in_weather_t2_a40',
  'in_weather_t2_a41',
  'in_weather_t2_a42',
  'in_weather_t2_a43',
  'in_weather_t2_a44',
  'in_weather_t2_a45',
  'in_weather_t2_a46',
  'in_weather_t2_a47',
  'in_weather_t2_a48',
  'in_weather_t2_a49',
  'in_weather_t2_a50',
  'in_weather_t2_a51',
  'in_weather_t2_a52',
  'in_weather_t2_a53',
  'in_weather_t2_a54',
  'in_weather_t2_a55',
  'in_weather_t2_a56',
  'in_weather_t2_a57',
  'in_weather_t2_a58',
  'in_weather_t2_a59',
  'in_weather_t2_a60',
  'in_weather_t2_a61',
  'in_weather_t2_a62',
  'in_weather_t2_a63',
  'in_weather_t2_a64',
  'in_weather_t2_a65',
  'in_weather_t2_a66',
  
  'in_weather_t3_a2',
  'in_weather_t3_a3',
  'in_weather_t3_a4',
  'in_weather_t3_a5',
  'in_weather_t3_a6',
  'in_weather_t3_a7',
  'in_weather_t3_a8',
  'in_weather_t3_a9',
  'in_weather_t3_a10',
  'in_weather_t3_a11',
  'in_weather_t3_a12',
  'in_weather_t3_a13',
  'in_weather_t3_a14',
  'in_weather_t3_a15',
  'in_weather_t3_a16',
  'in_weather_t3_a17',
  'in_weather_t3_a18',
  'in_weather_t3_a19',
  'in_weather_t3_a20',
  'in_weather_t3_a21',
  'in_weather_t3_a22',
  'in_weather_t3_a23',
  'in_weather_t3_a24',
  'in_weather_t3_a25',
  'in_weather_t3_a26',
  'in_weather_t3_a27',
  'in_weather_t3_a28',
  'in_weather_t3_a29',
  'in_weather_t3_a30',
  'in_weather_t3_a31',
  'in_weather_t3_a32',
  'in_weather_t3_a33',
  'in_weather_t3_a34',
  'in_weather_t3_a35',
  'in_weather_t3_a36',
  'in_weather_t3_a37',
  'in_weather_t3_a38',
  'in_weather_t3_a19',
  'in_weather_t3_a40',
  'in_weather_t3_a41',
  'in_weather_t3_a42',
  'in_weather_t3_a43',
  'in_weather_t3_a44',
  'in_weather_t3_a45',
  'in_weather_t3_a46',
  'in_weather_t3_a47',
  'in_weather_t3_a48',
  'in_weather_t3_a49',
  'in_weather_t3_a50',
  'in_weather_t3_a51',
  'in_weather_t3_a52',
  'in_weather_t3_a53',
  'in_weather_t3_a54',
  'in_weather_t3_a55',
  'in_weather_t3_a56',
  'in_weather_t3_a57',
  'in_weather_t3_a58',
  'in_weather_t3_a59',
  'in_weather_t3_a60',
  'in_weather_t3_a61',
  'in_weather_t3_a62',
  'in_weather_t3_a63',
  'in_weather_t3_a64',
  'in_weather_t3_a65',
  'in_weather_t3_a66',
  
  'in_poiCount_t2_a1',
  'in_poiCount_t2_a2',
  'in_poiCount_t2_a3',
  'in_poiCount_t2_a4',
  'in_poiCount_t2_a5',
  'in_poiCount_t2_a6',
  'in_poiCount_t2_a7',
  'in_poiCount_t2_a8',
  'in_poiCount_t2_a9',
  'in_poiCount_t2_a10',
  'in_poiCount_t2_a11',
  'in_poiCount_t2_a12',
  'in_poiCount_t2_a13',
  'in_poiCount_t2_a14',
  'in_poiCount_t2_a15',
  'in_poiCount_t2_a16',
  'in_poiCount_t2_a17',
  'in_poiCount_t2_a18',
  'in_poiCount_t2_a19',
  'in_poiCount_t2_a20',
  'in_poiCount_t2_a21',
  'in_poiCount_t2_a22',
  'in_poiCount_t2_a23',
  'in_poiCount_t2_a24',
  'in_poiCount_t2_a25',
  'in_poiCount_t2_a26',
  'in_poiCount_t2_a27',
  'in_poiCount_t2_a28',
  'in_poiCount_t2_a29',
  'in_poiCount_t2_a30',
  'in_poiCount_t2_a31',
  'in_poiCount_t2_a32',
  'in_poiCount_t2_a33',
  'in_poiCount_t2_a34',
  'in_poiCount_t2_a35',
  'in_poiCount_t2_a36',
  'in_poiCount_t2_a37',
  'in_poiCount_t2_a38',
  'in_poiCount_t2_a19',
  'in_poiCount_t2_a40',
  'in_poiCount_t2_a41',
  'in_poiCount_t2_a42',
  'in_poiCount_t2_a43',
  'in_poiCount_t2_a44',
  'in_poiCount_t2_a45',
  'in_poiCount_t2_a46',
  'in_poiCount_t2_a47',
  'in_poiCount_t2_a48',
  'in_poiCount_t2_a49',
  'in_poiCount_t2_a50',
  'in_poiCount_t2_a51',
  'in_poiCount_t2_a52',
  'in_poiCount_t2_a53',
  'in_poiCount_t2_a54',
  'in_poiCount_t2_a55',
  'in_poiCount_t2_a56',
  'in_poiCount_t2_a57',
  'in_poiCount_t2_a58',
  'in_poiCount_t2_a59',
  'in_poiCount_t2_a60',
  'in_poiCount_t2_a61',
  'in_poiCount_t2_a62',
  'in_poiCount_t2_a63',
  'in_poiCount_t2_a64',
  'in_poiCount_t2_a65',
  'in_poiCount_t2_a66',
  
  'in_poiCount_t3_a1',
  'in_poiCount_t3_a2',
  'in_poiCount_t3_a3',
  'in_poiCount_t3_a4',
  'in_poiCount_t3_a5',
  'in_poiCount_t3_a6',
  'in_poiCount_t3_a7',
  'in_poiCount_t3_a8',
  'in_poiCount_t3_a9',
  'in_poiCount_t3_a10',
  'in_poiCount_t3_a11',
  'in_poiCount_t3_a12',
  'in_poiCount_t3_a13',
  'in_poiCount_t3_a14',
  'in_poiCount_t3_a15',
  'in_poiCount_t3_a16',
  'in_poiCount_t3_a17',
  'in_poiCount_t3_a18',
  'in_poiCount_t3_a19',
  'in_poiCount_t3_a20',
  'in_poiCount_t3_a21',
  'in_poiCount_t3_a22',
  'in_poiCount_t3_a23',
  'in_poiCount_t3_a24',
  'in_poiCount_t3_a25',
  'in_poiCount_t3_a26',
  'in_poiCount_t3_a27',
  'in_poiCount_t3_a28',
  'in_poiCount_t3_a29',
  'in_poiCount_t3_a30',
  'in_poiCount_t3_a31',
  'in_poiCount_t3_a32',
  'in_poiCount_t3_a33',
  'in_poiCount_t3_a34',
  'in_poiCount_t3_a35',
  'in_poiCount_t3_a36',
  'in_poiCount_t3_a37',
  'in_poiCount_t3_a38',
  'in_poiCount_t3_a19',
  'in_poiCount_t3_a40',
  'in_poiCount_t3_a41',
  'in_poiCount_t3_a42',
  'in_poiCount_t3_a43',
  'in_poiCount_t3_a44',
  'in_poiCount_t3_a45',
  'in_poiCount_t3_a46',
  'in_poiCount_t3_a47',
  'in_poiCount_t3_a48',
  'in_poiCount_t3_a49',
  'in_poiCount_t3_a50',
  'in_poiCount_t3_a51',
  'in_poiCount_t3_a52',
  'in_poiCount_t3_a53',
  'in_poiCount_t3_a54',
  'in_poiCount_t3_a55',
  'in_poiCount_t3_a56',
  'in_poiCount_t3_a57',
  'in_poiCount_t3_a58',
  'in_poiCount_t3_a59',
  'in_poiCount_t3_a60',
  'in_poiCount_t3_a61',
  'in_poiCount_t3_a62',
  'in_poiCount_t3_a63',
  'in_poiCount_t3_a64',
  'in_poiCount_t3_a65',
  'in_poiCount_t3_a66'
]

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
        inputs.push(_.extend(input, {
          timeDiff: timeDiff
        }));
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
      var key = 'out_a' + o.area;
      if (obj[key]) {
        throw new Error('dup obj[key]', 'key=' + key);
      }
      obj[key] = o.gap;
    });
    _.each(td.input, function (inp, inputInd) {
      _.each(_.allKeys(_.omit(inp, ['gapRate', 'timeSpan', 'area', 'weather'])), function (key) {
        obj['in_' + key + '_t' + inp.timeDiff + '_a' + inp.area] = inp[key];
      });
    });
    obj = _.omit(obj, omitKeys);
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

