
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
          , head: []
          , border: []
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
        head: ['Cool'],
        style: {
          head: [],
          border: []
        }
    });

    table.width.should.eql(8);
  },

  'test vertical table output': function() {
    var table = new Table({ style: {'padding-left':0, 'padding-right':0, head:[], border:[]} }); // clear styles to prevent color output

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
    var table = new Table({ head: ["", "Header 1", "Header 2"], style: {'padding-left':0, 'padding-right':0, head:[], border:[]} }); // clear styles to prevent color output

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
  },

  'test table colors': function(){
    var table = new Table({
      head: ['Rel', 'By'],
      style: {head: ['red'], border: ['grey']}
    });

    table.push(
        ['v0.1', 'rauchg@gmail.com']
    );

    var off = '\u001b[39m', red = '\u001b[31m', grey = '\u001b[90m';
    var expected = [
        grey + '┌──────┬──────────────────┐' + off
      , grey + '│' + off + red + ' Rel  ' + off + grey + '│' + off + red + ' By               ' + off + grey + '│' + off
      , grey + '├──────┼──────────────────┤' + off
      , grey + '│' + off + ' v0.1 ' + grey + '│' + off + ' rauchg@gmail.com ' + grey + '│' + off
      , grey + '└──────┴──────────────────┘' + off
    ];

    table.toString().should.eql(expected.join("\n"));
  }
};
