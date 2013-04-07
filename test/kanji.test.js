
/**
 * Module requirements.
 */

require('should');

var Table = require('../');

/**
 * Tests.
 */

module.exports = {
    
    'test KANJI': function() {
        var table = new Table({
            head: ["", "Header 1", "Header 2"]
          , style: {
              'padding-left':0
            , 'padding-right':0
            , head:[]
            , border:[]
          }
        }); // clear styles to prevent color output
    
        table.push(
            {"Header 3": ['v0.1', '日本語  '] }
            , {"Header 4": ['v0.1', 'Japanese'] }
            );
        
        var expected = [
            '┌────────┬────────┬────────┐'
          , '│        │Header 1│Header 2│'
          , '├────────┼────────┼────────┤'
          , '│Header 3│v0.1    │日本語  │'
          , '├────────┼────────┼────────┤'
          , '│Header 4│v0.1    │Japanese│'
          , '└────────┴────────┴────────┘'
        ];
        
        // console.log(table.toString());
        table.toString().should.eql(expected.join("\n"));
    },
    
    'test KANJI_width': function() {
        var table = new Table({
            head: ['Rel', 'Change', 'By', 'When']
          , style: {
              'padding-left': 1
            , 'padding-right': 1
            , head: []
            , border: []
             }
          , colWidths: [6, 6, 7, 8]
        });
        
        table.push(
            ['v0.1', '1234567890', '1234567890', '1234567890']
          , ['v0.2', 'あいうえお', 'あいうえお', 'あいうえお']
          , ['v0.3', 'あいうえ',   'あいうえ',   'あいうえ']
          , ['v0.3', 'あいう',     'あいう',     'あいう']
          , ['v0.3', 'あい',       'あい',       'あい']
        );

        var expected = [
            '┌──────┬──────┬───────┬────────┐'
          , '│ Rel  │ Cha… │ By    │ When   │'
          , '├──────┼──────┼───────┼────────┤'
          , '│ v0.1 │ 123… │ 1234… │ 12345… │'
          , '├──────┼──────┼───────┼────────┤'
          , '│ v0.2 │ あ…  │ あい… │ あい…  │'
          , '├──────┼──────┼───────┼────────┤'
          , '│ v0.3 │ あ…  │ あい… │ あい…  │'
          , '├──────┼──────┼───────┼────────┤'
          , '│ v0.3 │ あ…  │ あい… │ あいう │'
          , '├──────┼──────┼───────┼────────┤'
          , '│ v0.3 │ あい │ あい  │ あい   │'
          , '└──────┴──────┴───────┴────────┘'            
        ];
        
        console.log(table.toString());
        table.toString().should.eql(expected.join("\n"));    
    }  
};
