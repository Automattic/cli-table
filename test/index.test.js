
/**
 * Module requirements.
 */

require('should');

var Table = require('../');

/**
 * Tests.
 */

module.exports = {

  'test complete table': function (){
    var table = new Table({ 
        head: ['Rel', 'Change', 'By', 'When']
      , style: {
            'padding-left': 1
          , 'padding-right': 1
        }
      , colWidths: [6, 21, 25, 17]
    });

    table.push(
        ['v0.1', 'Testing something cool', 'rauchg@gmail.com', '7 minutes ago']
      , ['v0.1', 'Testing something cool', 'rauchg@gmail.com', '8 minutes ago']
    );

    var expected = [
        '┌──────┬─────────────────────┬─────────────────────────┬─────────────────┐'
      , '│ Rel  │ Change              │ By                      │ When            │'
      , '├──────┼─────────────────────┼─────────────────────────┼─────────────────┤'
      , '│ v0.1 │ Testing something … │ rauchg@gmail.com        │ 7 minutes ago   │'
      , '├──────┼─────────────────────┼─────────────────────────┼─────────────────┤'
      , '│ v0.1 │ Testing something … │ rauchg@gmail.com        │ 8 minutes ago   │'
      , '└──────┴─────────────────────┴─────────────────────────┴─────────────────┘'
    ];

    table.toString().should.eql(expected.join("\n"));
  },

  'test width property': function (){
    var table = new Table({
        head: ['Cool']
    });

    table.width.should.eql(8);
  },

  'test vertical table output': function() {
    var table = new Table({ style: {} }); // clear styles to prevent color output

    table.push(
        {'v0.1': 'Testing something cool'}
      , {'v0.1': 'Testing something cool'}
    );

    var expected = [
        '┌────┬──────────────────────┐'
      , '│v0.1│Testing something cool│'
      , '├────┼──────────────────────┤'
      , '│v0.1│Testing something cool│'
      , '└────┴──────────────────────┘'
    ];

    table.toString().should.eql(expected.join("\n"));
  },

  'test cross table output': function() {
    var table = new Table({ head: ["", "Header 1", "Header 2"], style: {} }); // clear styles to prevent color output

    table.push(
        {"Header 3": ['v0.1', 'Testing something cool'] }
      , {"Header 4": ['v0.1', 'Testing something cool'] }
    );

    var expected = [
        '┌────────┬────────┬──────────────────────┐'
      , '│        │Header 1│Header 2              │'
      , '├────────┼────────┼──────────────────────┤'
      , '│Header 3│v0.1    │Testing something cool│'
      , '├────────┼────────┼──────────────────────┤'
      , '│Header 4│v0.1    │Testing something cool│'
      , '└────────┴────────┴──────────────────────┘'
    ];

    table.toString().should.eql(expected.join("\n"));
  }
};
