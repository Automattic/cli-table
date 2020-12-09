const stringWidth = require('string-width');

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
    if (len + 1 >= str.length) {
        const padlen = len - str.length;
        const right = Math.ceil(padlen / 2);
        const left = padlen - right;

        switch (dir) {
        case 'left':
            str = Array(padlen + 1).join(pad) + str;
            break;
        case 'both':
            str = Array(left + 1).join(pad) + str + Array(right + 1).join(pad);
            break;

        default:
            str = str + Array(padlen + 1).join(pad);
        }
    }
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
 * @param {Object} opts Supplied options
 * @return {Object} new (merged) object
 */

function options(defaults, opts) {
    for (const p in opts) {
        if (opts[p] && opts[p].constructor && opts[p].constructor === Object) {
            defaults[p] = defaults[p] || {};
            options(defaults[p], opts[p]);
        } else {
            defaults[p] = opts[p];
        }
    }
    return defaults;
}
exports.options = options;

//
// For consideration of terminal "color" programs like colors.js,
// which can add ANSI escape color codes to strings,
// we destyle the ANSI color escape codes for padding calculations.
//
// see: http://en.wikipedia.org/wiki/ANSI_escape_code
//
exports.strlen = function(str){
    const code = /\u001b\[(?:\d*;){0,5}\d*m/g; //eslint-disable-line no-control-regex
    const stripped = ('' + (str != null ? str : '')).replace(code,'');
    const split = stripped.split('\n');
    return split.reduce(function (memo, s) {
        const len = stringWidth(s);
        return (len > memo) ? len : memo;
    }, 0);
};
