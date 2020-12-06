/**
 * Module requirements.
 */

const Table = require('../');

/**
 * Tests.
 */

describe('Newlines module', () => {
  it('Should test table with newlines in headers', () => {
    const table = new Table({
        head: ['Test', "1\n2\n3"]
      , style: {
            'padding-left': 1
          , 'padding-right': 1
          , head: []
          , border: []
        }
    });

    const expected = [
        '┌──────┬───┐'
      , '│ Test │ 1 │'
      , '│      │ 2 │'
      , '│      │ 3 │'
      , '└──────┴───┘'
    ];

    expect(table.toString()).toEqual(expected.join("\n"));
  });

  it('Should test column width is accurately reflected when newlines are present', () => {
    const table = new Table({ head: ['Test\nWidth'], style: {head:[], border:[]} });
    expect(table.width).toBe(9);
  });

  it( 'Should test newlines in body cells', () => {
    const table = new Table({style: {head:[], border:[]}});

    table.push(["something\nwith\nnewlines"]);

    const expected = [
        '┌───────────┐'
      , '│ something │'
      , '│ with      │'
      , '│ newlines  │'
      , '└───────────┘'
    ];

    expect(table.toString()).toEqual(expected.join("\n"));
  });

  it('Should test newlines in vertical cell header and body', () => {
    const table = new Table({ style: {'padding-left':0, 'padding-right':0, head:[], border:[]} });

    table.push(
        {'v\n0.1': 'Testing\nsomething cool'}
    );

    const expected = [
        '┌───┬──────────────┐'
      , '│v  │Testing       │'
      , '│0.1│something cool│'
      , '└───┴──────────────┘'
    ];

    expect(table.toString()).toEqual(expected.join("\n"));
  });

  it('Should test newlines in cross table header and body', () => {
    const table = new Table({ head: ["", "Header\n1"], style: {'padding-left':0, 'padding-right':0, head:[], border:[]} });

    table.push({ "Header\n2": ['Testing\nsomething\ncool'] });

    const expected = [
        '┌──────┬─────────┐'
      , '│      │Header   │'
      , '│      │1        │'
      , '├──────┼─────────┤'
      , '│Header│Testing  │'
      , '│2     │something│'
      , '│      │cool     │'
      , '└──────┴─────────┘'
    ];

    expect(table.toString()).toEqual(expected.join("\n"));
  });
});
