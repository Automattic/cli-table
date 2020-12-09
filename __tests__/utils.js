/**
 * Internal dependencies
 */
const pad = require( '../lib/utils' ).pad;

describe('utils',() => {
    describe('pad', () => {
        it('pad(\'hello\',6,\' \', right) == \'hello \'', () => {
            expect(pad('hello', 6, ' ', 'right')).toBe('hello ');
        });

        it('pad(\'hello\',7,\' \', left) == \'  hello\'', () => {
            expect(pad('hello', 7, ' ', 'left')).toBe('  hello');
        });

        it('pad(\'hello\',8,\' \', both) == \' hello  \'', function () {
            expect(pad('hello', 8, ' ', 'both')).toBe(' hello  ');
        });

        it('pad(\'hello\',9,\' \', both) == \'  hello  \'', function () {
            expect(pad('hello', 9, ' ', 'both')).toBe('  hello  ');
        });

        it('pad(\'yw\',4,\' \', both) == \' yw \'', function () {
            expect(pad('yw', 4, ' ', 'both')).toBe(' yw ');
        });

        it('pad(\'hello\', 2, \' \', right) == \'hello\'', function () {
            expect(pad('hello', 2, ' ', 'right')).toBe('hello');
        });
    });
});
