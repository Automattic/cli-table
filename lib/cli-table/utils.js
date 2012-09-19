/**
 * Repeats a string.
 *
 * @param {String} char(s)
 * @param {Number} number of times
 * @return {String} repeated string
 */

exports.repeat = function (str, times){
  return Array(times + 1).join(str);
};

/**
 * Pads a string
 *
 * @api public
 */

exports.pad = function (str, len, pad, dir) {
  if (len + 1 >= str.length)
    switch (dir){
      case 'left':
        str = Array(len + 1 - str.length).join(pad) + str;
        break;
      
      case 'both':
        var right = Math.ceil((padlen = len - str.length) / 2);
        var left = padlen - right;
        str = Array(left + 1).join(pad) + str + Array(right + 1).join(pad);
        break;
 
      default:
        str = str + Array(len + 1 - str.length).join(pad);
    };

  return str;
};

/**
 * Truncates a string
 *
 * @api public
 */

exports.truncate = function (str, length, chr){
  chr = chr || '…';
  return str.length >= length ? str.substr(0, length - chr.length) + chr : str;
};

/**
 * Copies and merges options with defaults.
 *
 * @param {Object} defaults
 * @param {Object} supplied options
 * @return {Object} new (merged) object
 */

function clone(a){
  var b;
  if (Array.isArray(a)){
    b = [];
    for (var i = 0, l = a.length; i < l; i++)
      b.push(typeof a[i] == 'object' ? clone(a[i]) : a[i]);
    return b;
  } else if (typeof a == 'object'){
    b = {};
    for (var i in a)
      b[i] = typeof a[i] == 'object' ? clone(a[i]) : a[i];
    return b;
  }
  return a;
};

exports.options = function(defaults, opts) {
  var c, i, _i, _len, _results;
  c = clone(opts);
  _results = [];
  for (_i = 0, _len = defaults.length; _i < _len; _i++) {
    i = defaults[_i];
    if (i && [].__indexOf.call(opts, i) >= 0) {
      _results.push(c[_i] = i);
    }
  }
  return _results;
};

//
// For consideration of terminal "color" programs like colors.js,
// which can add ANSI escape color codes to strings,
// we destyle the ANSI color escape codes for padding calculations.
//
// see: http://en.wikipedia.org/wiki/ANSI_escape_code
//
exports.strlen = function(str){
  var code = /\u001b\[\d+m/g;
  var stripped = ("" + str).replace(code,'');
  var split = stripped.split("\n");
  return split.reduce(function (memo, s) { return (s.length > memo) ? s.length : memo }, 0);
}  
