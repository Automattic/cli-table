
/**
 * Module requirements.
 */

var Table = require('../lib/cli-table');

/**
 * Example.
 */

var table = new Table({ 
    head: ['Rel', 'Change', 'By', 'When']
  , colWidths: [6, 21, 25, 17]
});

table.push(
    ['v0.1', 'Testing something cool', 'rauchg@gmail.com', '7 minutes ago']
  , ['v0.1', 'Testing something cool', 'rauchg@gmail.com', '8 minutes ago']
);

console.log(table.toString());


var table = new Table({ 
    head: ['Rel', 'Change', 'By', 'When']
  , colWidths: [6, 21, 25, 17]
  , style : {compact : true, 'padding-left' : 1}
});

table.push(
    ['v0.1', 'Testing something cool', 'rauchg@gmail.com', '7 minutes ago']
  , ['v0.1', 'Testing something cool', 'rauchg@gmail.com', '8 minutes ago']
  , []
  , ['v0.1', 'Testing something cool', 'rauchg@gmail.com', '8 minutes ago']
);

console.log(table.toString());

var vertical_table = new Table({ head: ["Key", "Value"]});

vertical_table.push({ "Some Key": "Some Value"},
                    { "Another much longer key": "And its corresponding longer value"}
);

console.log(vertical_table.toString());
