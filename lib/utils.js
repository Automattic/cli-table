const stringWidth = require('string-width');

const DEFAULT_OPTIONS = {
    chars: {
        'top': '─',
        'top-mid': '┬',
        'top-left': '┌',
        'top-right': '┐',
        'bottom': '─',
        'bottom-mid': '┴',
        'bottom-left': '└',
        'bottom-right': '┘',
        'left': '│',
        'left-mid': '├',
        'mid': '─',
        'mid-mid': '┼',
        'right': '│',
        'right-mid': '┤',
        'middle': '│',
    },
    truncate: '…',
    colors: true,
    colWidths: [],
    colAligns: [],
    style: {
        'padding-left': 1,
        'padding-right': 1,
        head: ['red'],
        border: ['white'],
        compact: false,
    },
    head: [],
};

/**
 * Repeats a string.
 *
 * @param {String} char(s)
 * @param {Number} number of times
 * @return {String} repeated string
 */

function repeat(str, times){
    return Array(times + 1).join(str);
}

/**
 * Pads a string
 *
 * @api public
 */


function pad(str, len, pad, dir) {
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
}

/**
 * Truncates a string
 *
 * @api public
 */

function truncate(str, length, chr){
    chr = chr || '…';
    return str.length >= length ? str.substr(0, length - chr.length) + chr : str;
}

/**
 * Copies and merges options with defaults.
 *
 * @param {Object} defaults
 * @param {Object} opts Supplied options
 * @return {Object} new (merged) object
 */
function mergeOptions(defaults, opts) {
    opts = opts || {};
    const mergedOptions = JSON.parse(JSON.stringify(defaults || DEFAULT_OPTIONS));

    for (const p in opts) {
        if (opts[p] && opts[p].constructor && opts[p].constructor === Object) {
            mergedOptions[p] = mergedOptions[p] || {};
            mergeOptions(mergedOptions[p], opts[p]);
        } else {
            mergedOptions[p] = opts[p];
        }
    }
    return mergedOptions;
}


//
// For consideration of terminal "color" programs like colors.js,
// which can add ANSI escape color codes to strings,
// we destyle the ANSI color escape codes for padding calculations.
//
// see: http://en.wikipedia.org/wiki/ANSI_escape_code
//
function strLen(str){
    const code = /\u001b\[(?:\d*;){0,5}\d*m/g; //eslint-disable-line no-control-regex
    const stripped = ('' + (str != null ? str : '')).replace(code,'');
    const split = stripped.split('\n');
    return split.reduce(function (memo, s) {
        const len = stringWidth(s);
        return (len > memo) ? len : memo;
    }, 0);
}

module.exports = {
    DEFAULT_OPTIONS,
    mergeOptions,
    pad,
    repeat,
    strLen,
    truncate,
};
