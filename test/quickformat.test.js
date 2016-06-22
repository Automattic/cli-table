
/**
 * Module requirements.
 */

require('should');

var Table = require('../');

var rows = [
    { 'first_name': 'John', 'last_name': 'Doe' },
    { 'first_name': 'Jane', 'last_name': 'Doe' }
];

/**
 * Tests.
 */

module.exports = {

  'test quick table: rows only': function () {

        var table = Table.quick(rows);

        var expected = [
            '┌────────────┬───────────┐',
            '│ first_name │ last_name │',
            '├────────────┼───────────┤',
            '│ John       │ Doe       │',
            '├────────────┼───────────┤',
            '│ Jane       │ Doe       │',
            '└────────────┴───────────┘'
        ];
console.log(table.toString());
        var expected = [ '\u001b[90m┌────────────┬───────────┐\u001b[39m',
  '\u001b[90m│\u001b[39m\u001b[31m first_name \u001b[39m\u001b[90m│\u001b[39m\u001b[31m last_name \u001b[39m\u001b[90m│\u001b[39m',
  '\u001b[90m├────────────┼───────────┤\u001b[39m',
  '\u001b[90m│\u001b[39m John       \u001b[90m│\u001b[39m Doe       \u001b[90m│\u001b[39m',
  '\u001b[90m├────────────┼───────────┤\u001b[39m',
  '\u001b[90m│\u001b[39m Jane       \u001b[90m│\u001b[39m Doe       \u001b[90m│\u001b[39m',
  '\u001b[90m└────────────┴───────────┘\u001b[39m' ];

        table.toString().should.eql(expected.join("\n"));

  },

  'test quick table: with options': function() {

//         var _rows =  rows.map(function(row) {
//             return [row.first_name, row.last_name];
//         });

        var _rows = [
            ['v0.1', 'Testing something cool', 'rauchg@gmail.com', '7 minutes ago'],
            ['v0.1', 'Testing something cool', 'rauchg@gmail.com', '8 minutes ago']
        ];

        var table = Table.quick({
            'head': ['Rel', 'Change', 'By', 'When'],
            'colWidths': [6, 21, 25, 17],
            'style': {
                'padding-left': 1,
                'padding-right': 1,
                'head': [],
                'border': []
            }
        }, _rows);

    var expected = [
        '┌──────┬─────────────────────┬─────────────────────────┬─────────────────┐'
      , '│ Rel  │ Change              │ By                      │ When            │'
      , '├──────┼─────────────────────┼─────────────────────────┼─────────────────┤'
      , '│ v0.1 │ Testing something … │ rauchg@gmail.com        │ 7 minutes ago   │'
      , '├──────┼─────────────────────┼─────────────────────────┼─────────────────┤'
      , '│ v0.1 │ Testing something … │ rauchg@gmail.com        │ 8 minutes ago   │'
      , '└──────┴─────────────────────┴─────────────────────────┴─────────────────┘'
    ];

//         console.log(table.toString());

    table.toString().should.eql(expected.join("\n"));

  }

};
