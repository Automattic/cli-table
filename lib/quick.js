'use strict';

module.exports = function(options, rows) {

    var Table = require('./');
    var utils = require('./utils');

    if (utils.is('Array', options)) {
        rows = options;
        var headings = rows.reduce((prev, curr, i, data) => {
            for (var k in curr) {
                if (prev.indexOf(k) < 0) {
                    prev.push(k);
                }
            }
            return prev;
        }, []);
        var colWidths = headings.map((heading) => {
            var w = heading.length + 2;
            rows.forEach((row) => {
                if (row[heading] && (row[heading].length + 2) > w) {
                    w = row[heading].length + 2;
                }
            });
            return w;
        });
        var table = new Table({
            'head': headings,
            'colWidths': colWidths
        });
        rows = rows.map((row) => {
            var r = [];
            headings.forEach((h) => {
                r.push(row[h]);
            });
            return r;
        });
        table.push.apply(table, rows);
        return table;
    } else {
        var table = new Table(options);
        rows = rows || [];
        table.push.apply(table, rows);
        return table;
    }

};
