
/**
 * Module requirements.
 */

var Table = require('../lib');

/**
 * Example.
 */

/* col widths */
var table = new Table({
    head: ['Rel', 'Change', 'By', 'When']
  , colWidths: [6, 21, 25, 17]
});

table.push(
    ['v0.1', 'Testing something cool', 'rauchg@gmail.com', '7 minutes ago']
  , ['v0.1', 'Testing something cool', 'rauchg@gmail.com', '8 minutes ago']
);

console.log(table.toString());


/* compact */
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

/* headless */
var headless_table = new Table();
headless_table.push(['v0.1', 'Testing something cool', 'rauchg@gmail.com', '7 minutes ago']);
console.log(headless_table.toString());

/* vertical */
var vertical_table = new Table();
vertical_table.push({ "Some Key": "Some Value"},
                    { "Another much longer key": "And its corresponding longer value"}
);

console.log(vertical_table.toString());

/* cross */
var cross_table = new Table({ head: ["", "Header #1", "Header #2"] });
cross_table.push({ "Header #3": ["Value 1", "Value 2"] },
                 { "Header #4": ["Value 3", "Value 4"] });
console.log(cross_table.toString());


/* multibytes characters */
var table = new Table({
    head: ['排名', '城市', '定位', 'GDP(亿元)', '人均GDP(元)', 'GDP较上一年增速(%)']
});

table.push(
    ['1', '上海', '中国经贸中心, 建设为国际大都市', '23560.94', '97555', '9.07']
  , ['2', '北京', '中国政治及国际交往中心', '21330.80', '100864', '9.39']
);

console.log(table.toString());
