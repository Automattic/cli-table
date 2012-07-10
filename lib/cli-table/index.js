
/**
 * Module dependencies.
 */

var utils = require('./utils')
  , repeat = utils.repeat
  , truncate = utils.truncate
  , pad = utils.pad;

require('colors');

/**
 * Table constructor
 *
 * @param {Object} options
 * @api public
 */

function Table (options){
  this.options = utils.options({
      chars: {
          'top': '━'
        , 'top-mid': '┳'
        , 'top-left': '┏'
        , 'top-right': '┓'
        , 'bottom': '━'
        , 'bottom-mid': '┻'
        , 'bottom-left': '┗' 
        , 'bottom-right': '┛'
        , 'left': '┃'
        , 'left-mid': '┣'
        , 'mid': '━'
        , 'mid-mid': '╋'
        , 'right': '┃'
        , 'right-mid': '┫'
      }
    , truncate: '…'
    , colWidths: []
    , colAligns: []
    , style: {
          'padding-left': 1
        , 'padding-right': 1
        , head: ['cyan']
        , compact : false
      }
    , head: []
  }, options);
};

/**
 * Inherit from Array.
 */

Table.prototype.__proto__ = Array.prototype;

/**
 * Width getter
 *
 * @return {Number} width
 * @api public
 */

Table.prototype.__defineGetter__('width', function (){
  var str = this.toString().split("\n");
  if (str.length) return str[0].length;
  return 0;
});

/**
 * Render to a string.
 *
 * @return {String} table representation
 * @api public
 */

Table.prototype.render 
Table.prototype.toString = function (){
  var ret = ''
    , options = this.options
    , style = options.style
    , head = options.head
    , chars = options.chars
    , truncater = options.truncate
      , colWidths = options.colWidths || new Array(this.head.length)
      , totalWidth = 0;
    
    if (!head.length && !this.length) return '';

    if (!colWidths.length){
      this.slice(0).concat([head]).forEach(function(cells){
        if (cells.length) {
          cells.forEach(function(cell, i){
            colWidths[i] = Math.max(colWidths[i] || 0, get_width(cell) || 0);
          });
        } else {
          var header_cell = Object.keys(cells)[0]
            , value_cell = cells[header_cell];

          colWidths[0] = Math.max(colWidths[0] || 0, get_width(header_cell) || 0);
          colWidths[1] = Math.max(colWidths[1] || 0, get_width(value_cell) || 0);
        }
    });
  };

  totalWidth = (colWidths.length == 1 ? colWidths[0] : colWidths.reduce(
    function (a, b){
      return a + b
    })) + colWidths.length + 1;

  function get_width(obj) {
    return width = typeof obj == 'object' && obj.width != undefined
         ? obj.width
         : ((typeof obj == 'object' ? utils.strlen(obj.text) : utils.strlen(obj)) + (style['padding-left'] || 0) + (style['padding-right'] || 0))
  }

  // draws a line
  function line (line, left, right, intersection){
    var width = 0
      , line =
          left
        + repeat(line, totalWidth - 2)
        + right;

    colWidths.forEach(function (w, i){
      if (i == colWidths.length - 1) return;
      width += w + 1;
      line = line.substr(0, width) + intersection + line.substr(width + 1);
    });

    ret += line;
  };

  // draws the top line
  function lineTop (){
    line(chars.top
       , chars['top-left'] || chars.top
       , chars['top-right'] ||  chars.top
       , chars['top-mid']);
    ret += "\n";
  };

  // renders a string, by padding it or truncating it
  function string (str, index){
    var str = String(typeof str == 'object' && str.text ? str.text : str)
      , length = utils.strlen(str)
      , width = colWidths[index]
          - (style['padding-left'] || 0)
          - (style['padding-right'] || 0)
      , align = options.colAligns[index] || 'left';

    return repeat(' ', style['padding-left'] || 0)
         + (length == width ? str :
             (length < width 
              ? pad(str, ( width + (str.length - length) ), ' ', align == 'left' ? 'right' :
                  (align == 'middle' ? 'both' : 'left'))
              : (truncater ? truncate(str, width, truncater) : str))
           )
         + repeat(' ', style['padding-right'] || 0);
  };

  if (head.length){
    lineTop();

    ret += chars.left;
    
    head.forEach(function (th, index){
      var text = string(th, index);
      if (style.head){
        style.head.forEach(function(style){
          text = text[style];
        });
      }

      ret += text;
      ret += chars.right;
    });

    ret += "\n";
  }

  if (this.length)
    this.forEach(function (cells, i){
      if (!head.length && i == 0)
        lineTop();
      else {
        if (!style.compact || i<(!!head.length) ?1:0 || cells.length == 0){
          line(chars.mid
             , chars['left-mid']
             , chars['right-mid']
             , chars['mid-mid']);
             
          ret += "\n" 
        }

        if (cells.hasOwnProperty("length") && !cells.length)
          return

        if (cells.hasOwnProperty("length")) {
          ret += chars.left;

          cells.forEach(function(cell, i){
            ret += string(cell, i);
            ret += chars.right;
          });

          ret += "\n";
        } else if (typeof cells === 'object') {
          var key = Object.keys(cells)[0]
            , value = cells[key];

          if (style.head){
            style.head.forEach(function(style){
              key = key[style];
            });
          }

          ret += chars.left + string(key, 0) + chars.right +
                 string(value, 1) + chars.right + "\n"
        }
      }
    });

  line(chars.bottom
     , chars['bottom-left'] || chars.bottom
     , chars['bottom-right'] || chars.bottom
     , chars['bottom-mid']);

  return ret;
};

/**
 * Module exports.
 */

module.exports = Table;

module.exports.version = '0.0.1';
