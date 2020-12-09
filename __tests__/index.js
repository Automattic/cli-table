
/**
 * Module requirements.
 */

const Table = require('../');

/**
 * Tests.
 */

describe( 'index.js', () => {
    it( 'Complete table should be correctly rendered', () => {
        const table = new Table({
            head: ['Rel', 'Change', 'By', 'When'],
            style: {
                'padding-left': 1,
                'padding-right': 1,
                head: [],
                border: []
            },
            colWidths: [6, 21, 25, 17]
        });

        table.push(
            ['v0.1', 'Testing something cool', 'rauchg@gmail.com', '7 minutes ago']
            , ['v0.1', 'Testing something cool', 'rauchg@gmail.com', '8 minutes ago']
        );

        const expected = [
            '┌──────┬─────────────────────┬─────────────────────────┬─────────────────┐'
            , '│ Rel  │ Change              │ By                      │ When            │'
            , '├──────┼─────────────────────┼─────────────────────────┼─────────────────┤'
            , '│ v0.1 │ Testing something … │ rauchg@gmail.com        │ 7 minutes ago   │'
            , '├──────┼─────────────────────┼─────────────────────────┼─────────────────┤'
            , '│ v0.1 │ Testing something … │ rauchg@gmail.com        │ 8 minutes ago   │'
            , '└──────┴─────────────────────┴─────────────────────────┴─────────────────┘'
        ];

        expect(table.toString()).toEqual(expected.join('\n'));
    } );

    it( 'Should test width property', () => {
        const table = new Table({
            head: ['Cool'],
            style: {
                head: [],
                border: []
            }
        });

        expect(table.width).toBe(8);
    } );

    it( 'Should test vertical table output', () => {
        const table = new Table({ style: {'padding-left':0, 'padding-right':0, head:[], border:[]} }); // clear styles to prevent color output

        table.push(
            {'v0.1': 'Testing something cool'}
            , {'v0.1': 'Testing something cool'}
        );

        const expected = [
            '┌────┬──────────────────────┐'
            , '│v0.1│Testing something cool│'
            , '├────┼──────────────────────┤'
            , '│v0.1│Testing something cool│'
            , '└────┴──────────────────────┘'
        ];

        expect(table.toString()).toEqual(expected.join('\n'));
    } );

    it( 'Should test cross table output', () => {
        const table = new Table({ head: ['', 'Header 1', 'Header 2'], style: {'padding-left':0, 'padding-right':0, head:[], border:[]} }); // clear styles to prevent color output

        table.push(
            {'Header 3': ['v0.1', 'Testing something cool'] }
            , {'Header 4': ['v0.1', 'Testing something cool'] }
        );

        const expected = [
            '┌────────┬────────┬──────────────────────┐'
            , '│        │Header 1│Header 2              │'
            , '├────────┼────────┼──────────────────────┤'
            , '│Header 3│v0.1    │Testing something cool│'
            , '├────────┼────────┼──────────────────────┤'
            , '│Header 4│v0.1    │Testing something cool│'
            , '└────────┴────────┴──────────────────────┘'
        ];

        expect(table.toString()).toEqual(expected.join('\n'));
    } );

    it( 'Should test table colors', () => {
        const table = new Table({
            head: ['Rel', 'By'],
            style: {head: ['red'], border: ['grey']}
        });

        const off = '\u001b[39m'
            , red = '\u001b[31m'
            , orange = '\u001b[38;5;221m'
            , grey = '\u001b[90m'

            , c256s = orange + 'v0.1' + off;

        table.push(
            [c256s, 'rauchg@gmail.com']
        );

        const expected = [
            grey + '┌──────┬──────────────────┐' + off
            , grey + '│' + off + red + ' Rel  ' + off + grey + '│' + off + red + ' By               ' + off + grey + '│' + off
            , grey + '├──────┼──────────────────┤' + off
            , grey + '│' + off + ' ' + c256s + ' ' + grey + '│' + off + ' rauchg@gmail.com ' + grey + '│' + off
            , grey + '└──────┴──────────────────┘' + off
        ];

        expect(table.toString()).toEqual(expected.join('\n'));
    } );

    it( 'Should test custom chars', () => {
        const table = new Table({
            chars: {
                'top': '═'
                , 'top-mid': '╤'
                , 'top-left': '╔'
                , 'top-right': '╗'
                , 'bottom': '═'
                , 'bottom-mid': '╧'
                , 'bottom-left': '╚'
                , 'bottom-right': '╝'
                , 'left': '║'
                , 'left-mid': '╟'
                , 'right': '║'
                , 'right-mid': '╢'
            },
            style: {
                head: []
                , border: []
            }
        });

        table.push(
            ['foo', 'bar', 'baz']
            , ['frob', 'bar', 'quuz']
        );

        const expected = [
            '╔══════╤═════╤══════╗'
            , '║ foo  │ bar │ baz  ║'
            , '╟──────┼─────┼──────╢'
            , '║ frob │ bar │ quuz ║'
            , '╚══════╧═════╧══════╝'
        ];

        expect(table.toString()).toEqual(expected.join('\n'));
    } );

    it( 'Should test compact shortand', () => {
        const table = new Table({
            style: {
                head: []
                , border: []
                , compact : true
            }
        });

        table.push(
            ['foo', 'bar', 'baz']
            , ['frob', 'bar', 'quuz']
        );

        const expected = [
            '┌──────┬─────┬──────┐'
            , '│ foo  │ bar │ baz  │'
            , '│ frob │ bar │ quuz │'
            , '└──────┴─────┴──────┘'
        ];

        expect(table.toString()).toEqual(expected.join('\n'));
    } );

    it( 'Should test compact empty mid line', () => {
        const table = new Table({
            chars: {
                'mid': ''
                , 'left-mid': ''
                , 'mid-mid': ''
                , 'right-mid': ''
            },
            style: {
                head: []
                , border: []
            }
        });

        table.push(
            ['foo', 'bar', 'baz']
            , ['frob', 'bar', 'quuz']
        );

        const expected = [
            '┌──────┬─────┬──────┐'
            , '│ foo  │ bar │ baz  │'
            , '│ frob │ bar │ quuz │'
            , '└──────┴─────┴──────┘'
        ];

        expect(table.toString()).toEqual(expected.join('\n'));
    } );

    it( 'Should test decoration lines disabled', () => {
        const table = new Table({
            chars: {
                'top': ''
                , 'top-mid': ''
                , 'top-left': ''
                , 'top-right': ''
                , 'bottom': ''
                , 'bottom-mid': ''
                , 'bottom-left': ''
                , 'bottom-right': ''
                , 'left': ''
                , 'left-mid': ''
                , 'mid': ''
                , 'mid-mid': ''
                , 'right': ''
                , 'right-mid': ''
                , 'middle': ' ' // a single space
            },
            style: {
                head: []
                , border: []
                , 'padding-left': 0
                , 'padding-right': 0
            }
        });

        table.push(
            ['foo', 'bar', 'baz']
            , ['frobnicate', 'bar', 'quuz']
        );

        const expected = [
            'foo        bar baz '
            , 'frobnicate bar quuz'
        ];

        expect(table.toString()).toEqual(expected.join('\n'));
    } );

    it( 'Should test with null/undefined as values or column names', () => {
        const table = new Table({
            style: {
                head: []
                , border: []
            }
        });

        table.push(
            [null, undefined, 0]
        );

        const expected = [
            '┌──┬──┬───┐'
            , '│  │  │ 0 │'
            , '└──┴──┴───┘'
        ];

        expect(table.toString()).toEqual(expected.join('\n'));
    } );

    it( 'Should test with unicode string as values or column names ', () => {
        const table = new Table({
            head: ['版本', '修订', '作者', '日期']
            , style: {
                'padding-left': 1
                , 'padding-right': 1
                , head: []
                , border: []
            }
            , colWidths: [6, 21, 25, 17]
        });

        table.push(
            ['v0.1', '增加一些新特性', 'rauchg@gmail.com', '7 分钟前']
            , ['v0.1', '增加一些新特性', 'rauchg@gmail.com', '8 分钟前']
        );

        const expected = [
            '┌──────┬─────────────────────┬─────────────────────────┬─────────────────┐'
            , '│ 版本 │ 修订                │ 作者                    │ 日期            │'
            , '├──────┼─────────────────────┼─────────────────────────┼─────────────────┤'
            , '│ v0.1 │ 增加一些新特性      │ rauchg@gmail.com        │ 7 分钟前        │'
            , '├──────┼─────────────────────┼─────────────────────────┼─────────────────┤'
            , '│ v0.1 │ 增加一些新特性      │ rauchg@gmail.com        │ 8 分钟前        │'
            , '└──────┴─────────────────────┴─────────────────────────┴─────────────────┘'
        ];

        expect(table.toString()).toEqual(expected.join('\n'));
    } );

    it( 'Should test disable colors', () => {
        const table = new Table({ head: ['', 'Header 1', 'Header 2'], colors: false });

        table.push(
            {'Header 3': ['v0.1', 'Testing something cool'] }
            , {'Header 4': ['v0.1', 'Testing something cool'] }
        );

        const expected = [
            '┌──────────┬──────────┬────────────────────────┐'
            , '│          │ Header 1 │ Header 2               │'
            , '├──────────┼──────────┼────────────────────────┤'
            , '│ Header 3 │ v0.1     │ Testing something cool │'
            , '├──────────┼──────────┼────────────────────────┤'
            , '│ Header 4 │ v0.1     │ Testing something cool │'
            , '└──────────┴──────────┴────────────────────────┘'
        ];

        expect(table.toString()).toEqual(expected.join('\n'));
    } );
} );

