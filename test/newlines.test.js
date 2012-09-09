/**
 * Module requirements.
 */

require('should');

var Table = require('cli-table');

/**
 * Tests.
 */

module.exports = {
  'test table with newlines in headers': function() {
    var table = new Table({
        head: ['Test', "1\n2\n3"]
      , style: {
            'padding-left': 1
          , 'padding-right': 1
        }
    });

    var expected = [
        '┌──────┬───┐'
      , '│ Test │ 1 │'
      , '│      │ 2 │'
      , '│      │ 3 │'
      , '└──────┴───┘'
    ];

    table.toString().should.eql(expected.join("\n"));
  },

  'test column width is accurately reflected when newlines are present': function() {
    var table = new Table({ head: ['Test\nWidth'] });
    table.width.should.eql(9);
  }
};
