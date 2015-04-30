
/**
 * Module dependencies.
 */

var colors = require('colors/safe')
  , utils = require('./utils')
  , repeat = utils.repeat
  , truncate = utils.truncate
  , pad = utils.pad
  , _ = require("lodash");

/**
 * Table constructor
 *
 * @param {Object} options
 * @api public
 */

function Table (options){
  this.options = utils.options({
      chars: {
          'top': '─'
        , 'top-mid': '┬'
        , 'top-left': '┌'
        , 'top-right': '┐'
        , 'bottom': '─'
        , 'bottom-mid': '┴'
        , 'bottom-left': '└'
        , 'bottom-right': '┘'
        , 'left': '│'
        , 'left-mid': '├'
        , 'mid': '─'
        , 'mid-mid': '┼'
        , 'right': '│'
        , 'right-mid': '┤'
        , 'middle': '│'
      }
    , truncate: '…'
    , colWidths: []
    , colAligns: []
    , style: {
          'padding-left': 1
        , 'padding-right': 1
        , head: ['red']
        , border: ['grey']
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

Table.prototype.render = 
Table.prototype.toString = function (){
  var ret = ''
    , options = this.options
    , style = options.style
    , head = options.head
    , chars = options.chars
    , truncater = options.truncate
    , colWidths = options.colWidths || new Array(this.head.length)
    , totalWidth = 0
    , terminal_width = process.stdout.columns;
  
  // The minimum width of a column when terminal width is above table's required one.
  // NOTE: Columns which have required width below min_column_width will be renedered with their required width.  
  var min_column_width = options.min_column_width || 15 ;
  if (!head.length && !this.length) return '';

  if (!colWidths.length){
    var all_rows = this.slice(0);
    if (head.length) { all_rows = all_rows.concat([head]) };

    all_rows.forEach(function(cells){
      // horizontal (arrays)
      if (typeof cells === 'object' && cells.length) {
        extractColumnWidths(cells);
      // vertical (objects)
      } else {
        var header_cell = Object.keys(cells)[0]
          , value_cell = cells[header_cell];

        colWidths[0] = Math.max(colWidths[0] || 0, get_width(header_cell) || 0);

        // cross (objects w/ array values)
        if (typeof value_cell === 'object' && value_cell.length) {
          extractColumnWidths(value_cell, 1);
        } else {
          colWidths[1] = Math.max(colWidths[1] || 0, get_width(value_cell) || 0);
        }
      }
    });

    calc_required_width = function(){
      sum = 0;
      colWidths.map(function(item){
          sum += item;
      });
      //sum of columns, borders
      return sum + ((colWidths.length*2) - 1);
    };

    //Make sure total column widths don't exceed terminal width
    required_width = calc_required_width();
    if(terminal_width <= required_width) {
      var remaining_terminal_width = terminal_width - (colWidths.length * 2);
      var remaining_required_width = required_width;
      var calculated_values = [];
      
      var recalculate_col_widths = function() {
        calculated_values.forEach(function(calc_value) {
          var value = Math.floor((calc_value.original_value/remaining_required_width)*remaining_terminal_width);
          if(value < min_column_width) {
            // static value found - the column cannot be narrowed anymore
            remaining_terminal_width -= min_column_width;
            remaining_required_width -= calc_value.original_value;
            _.pull(calculated_values, calc_value);
            colWidths[calc_value.ind] = min_column_width;
            recalculate_col_widths();
          } else {
            // dynamic value found - set columnWidth and continue recalculation
            colWidths[calc_value.ind] =  value;
          }
        });
      };

      colWidths = colWidths.map(function(col, index){
        if(col < min_column_width){
            var ceil = Math.ceil(col);
            remaining_terminal_width -= ceil;
            remaining_required_width -= ceil;
            recalculate_col_widths();
            return ceil;
        }
        
        var calculated_value = Math.floor((col/remaining_required_width)*remaining_terminal_width);
        if(calculated_value >= min_column_width) {
            calculated_values.push({original_value: col, ind: index});
            return calculated_value;
        } 
        
        remaining_terminal_width -= min_column_width;
        remaining_required_width -= col;
        recalculate_col_widths();
        
        return min_column_width;
      });
    }

    calc_req_width = calc_required_width();
    if(calc_req_width > terminal_width) {
      console.warn("Calculated width "+ calc_req_width +" is above terminal width: " + terminal_width + ". You can try using smaller value for min_column_width. Current value is: " + min_column_width);
    }
    
    this.options.colWidths = colWidths;
  };

  totalWidth = (colWidths.length == 1 ? colWidths[0] : colWidths.reduce(
    function (a, b){
      return a + b
    })) + colWidths.length + 1;

  function extractColumnWidths(arr, offset) {
    var offset = offset || 0;
    arr.forEach(function(cell, i){
      colWidths[i + offset] = Math.max(colWidths[i + offset] || 0, get_width(cell) || 0);
    });
  };

  function get_width(obj) {
    return typeof obj == 'object' && obj.width != undefined
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

    return applyStyles(options.style.border, line);
  };

  // draws the top line
  function lineTop (){
    var l = line(chars.top
               , chars['top-left'] || chars.top
               , chars['top-right'] ||  chars.top
               , chars['top-mid']);
    if (l)
      ret += l + "\n";
  };

  /**
  * Checks if the passed character is a non-word symbol.
  * @param {string} character The symbol to check.
  */
  function isDelimiter(character){
    return character && character.length === 1 && character.match(/\W/);
  }

  /**
  * Gets number of symbols which should be added to the line
  * as it contains colorization symbols.
  * Symbols are added until we reach wrap_line_length symbols of text
  * which do not contain colorization.
  * @param {string} content The whole text that will be split.
  * @param {number} wrap_line_length Max number of symbols that we can have on the line.
  * @return number value indicating sum of all code symbols in the text, that we'll use for current line.
  */
  function extendWrapLine(content, wrap_line_length) {
    var hasColorization = content.match(/(\u001b\[(?:\d*;){0,5}\d*m)/g);
     if(!hasColorization) {
      return 0;
     }

    var colorizationSymbols = hasColorization.join("").length;

    if((content.length - colorizationSymbols) <= wrap_line_length){
      return colorizationSymbols;
    }
    
    var textToTake = content.substring(0, wrap_line_length);
    var sumOfSymbolsToAdd = 0; 
    var mtch = [];
    while(mtch = textToTake.match(/(\u001b\[(?:\d*;){0,5}\d*m)/)) {
      sumOfSymbolsToAdd += mtch[1].length;
      var indexOfMatch = textToTake.indexOf(mtch[1]);
      textToTake = textToTake.substring(0, indexOfMatch) + textToTake.substring(indexOfMatch + mtch[1].length);
    }

    if(sumOfSymbolsToAdd === 0) {
      return 0;
    } else {
      return sumOfSymbolsToAdd + extendWrapLine(textToTake, wrap_line_length + sumOfSymbolsToAdd);
    }
  };

  /**
  * Gets the number of "code" groups in the string.
  * @param {string} line The text to be checked.
  * @return Number of "code" groups.
  */
  function findNumberOfCodes(line) {
    var count = 0;
    while(mtch = line.match(/(\u001b\[(?:\d*;){0,5}\d*m)/)) {
      count++;
      var indexOfMatch = line.indexOf(mtch[1]);
      line = line.substring(0, indexOfMatch) + line.substring(indexOfMatch + mtch[1].length);
    }

    return count;
  };

  /**
  * Split text on several lines. Line's length is passed as paramater and it is the maximum number of symbols
  * that will be used on the line.
  * @param {string} content The text to be split.
  * @param {number} wrap_line_length Maximum number of symbols allowed on each line.
  * @return String splitted on several lines.
  */
  function beautify_string(content, wrap_line_length) {
    var padding = (style['padding-left'] || 0) + (style['padding-right'] || 0);
    var wrap_value = wrap_line_length > padding ? wrap_line_length - padding : 250;
    var symbolsToAdd =  extendWrapLine(content, wrap_value);
    wrap_value += symbolsToAdd;
    var current_line = content || "";
    if (content) {
      if (content.length > wrap_value) {
        var remaining = "";
        var row = _.take(content.split(""), wrap_value);

        // check if the symbol after wrap_value is delimiter;
        if (isDelimiter(content[wrap_value])) {
          wrap_value = get_index_after_code(content, wrap_value);
          current_line = content.substring(0, wrap_value).trim();
          remaining = content.substring(wrap_value).trim();
        } else {
          // find last delimiters
          var index = _.findLastIndex(row, function(chr) {
            return isDelimiter(chr);
          });

          if(index <= 0) {
            //no delimiter, lets just split the word
            index = wrap_value;
          }
          index = get_index_after_code(content, index);
          current_line = content.substring(0, index).trim();
          remaining = content.substring(index).trim();
        }

        var numberOfCodes = findNumberOfCodes(current_line);
        if(numberOfCodes % 2 !== 0) {
          var nextCodeMatch = current_line.match(/[\s\S]*(\u001b\[(?:\d*;){0,5}\d*m)/); //greedy
          if(nextCodeMatch) {
            var nextCode = nextCodeMatch[1];
            remaining = nextCode + remaining;
          }
        }
      }

      return current_line + (remaining ? ('\n' + beautify_string(remaining, wrap_line_length) ): "");
    }

    // If there's no content or it's width is below wrap_line_length, return the value
    return current_line;
  };
  
  /**
  * Gets the index on which the text should be splitted. In case the symbol on the index 
  * where we'll split is part of "code" segment, make sure to include the whole segment.
  * @param {string} content The text to be split.
  * @param {number} index The index where the string will be splitted.
  * @return Number The index on which we have to split the string.
  */
  function get_index_after_code(content, index) {
    var temp = content.substring(0, index + 10);
    var code_match = temp.match(/[\s\S]*(\u001b\[(?:\d*;){0,5}\d*m)/);
    if(code_match) {
      var code = code_match[1];
      var indexOfCode = temp.indexOf(code);
      if(indexOfCode <= index && index <= indexOfCode + code.length) {
        index = indexOfCode + code.length;
      }
    }

    return index;
  }

  function generateRow (items, style) {
    var cells = []
      , max_height = 0;

    // prepare vertical and cross table data
    if (!Array.isArray(items) && typeof items === "object") {
      var key = Object.keys(items)[0]
        , value = items[key]
        , first_cell_head = true;

      if (Array.isArray(value)) {
        items = value;
        items.unshift(key);
      } else {
        items = [key, value];
      }
    }

    // transform array of item strings into structure of cells
    items.forEach(function (item, i) {
      var contents = beautify_string(item.toString(), this.options.colWidths[i])
        .split("\n")
        .reduce(function (memo, l) {
          memo.push(string(l, i));
          return memo;
        }, [])

      var height = contents.length;
      if (height > max_height) { max_height = height };

      cells.push({ contents: contents , height: height });
    }.bind(this));

    // transform vertical cells into horizontal lines
    var lines = new Array(max_height);
    cells.forEach(function (cell, i) {
      cell.contents.forEach(function (line, j) {
        if (!lines[j]) { lines[j] = [] };
        if (style || (first_cell_head && i === 0 && options.style.head)) {
          line = applyStyles(options.style.head, line)
        }

        lines[j].push(line);
      });

      // populate empty lines in cell
      for (var j = cell.height, l = max_height; j < l; j++) {
        if (!lines[j]) { lines[j] = [] };
        lines[j].push(string('', i));
      }
    });
    var ret = "";
    lines.forEach(function (line, index) {
      if (ret.length > 0) {
        ret += "\n" + applyStyles(options.style.border, chars.left);
      }

      ret += line.join(applyStyles(options.style.border, chars.middle)) + applyStyles(options.style.border, chars.right);
    });

    return applyStyles(options.style.border, chars.left) + ret;
  };

  function applyStyles(styles, subject) {
    if (!subject)
      return '';
    styles.forEach(function(style) {
      subject = colors[style](subject);
    });
    return subject;
  };

  // renders a string, by padding it or truncating it
  function string (str, index){
    var str = String(typeof str == 'object' && str.text ? str.text : str)
      , length = utils.strlen(str)
      , width = options.colWidths[index]
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

    ret += generateRow.call(this,head, style.head) + "\n"
  }

  if (this.length)
    this.forEach(function (cells, i){
      if (!head.length && i == 0)
        lineTop();
      else {
        if (!style.compact || i<(!!head.length) ?1:0 || cells.length == 0){
          var l = line(chars.mid
                     , chars['left-mid']
                     , chars['right-mid']
                     , chars['mid-mid']);
          if (l)
            ret += l + "\n"
        }
      }

      if (cells.hasOwnProperty("length") && !cells.length) {
        return
      } else {
        ret += generateRow.call(this,cells) + "\n";
      };
    }.bind(this));

  var l = line(chars.bottom
             , chars['bottom-left'] || chars.bottom
             , chars['bottom-right'] || chars.bottom
             , chars['bottom-mid']);
  if (l)
    ret += l;
  else
    // trim the last '\n' if we didn't add the bottom decoration
    ret = ret.slice(0, -1);

  return ret;
};

/**
 * Module exports.
 */

module.exports = Table;

module.exports.version = '0.0.1';
