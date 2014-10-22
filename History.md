
0.3.0 / 2014-02-02
==================

 * Switch version of colors to avoid npm broken-ness
 * Handle custom colored strings correctly
 * Removing var completely as return var width caused other problems.
 * Fixing global leak of width variable.
 * Omit horizontal decoration lines if empty
 * Add a test for the the compact mode
 * Make line() return the generated string instead of appending it to ret
 * Customize the vertical cell separator separately from the right one
 * Allow newer versions of colors to be used
 * Added test for bordercolor
 * Add bordercolor in style options and enable deepcopy of options

0.2.0 / 2012-10-21
==================

  * test: avoid module dep in tests
  * fix type bug on integer vertical table value
  * handle newlines in vertical and cross tables
  * factor out common style setting function
  * handle newlines in body cells
  * fix render bug when no header provided
  * correctly calculate width of cells with newlines
  * handles newlines in header cells
  * ability to create cross tables
  * changing table chars to ones that windows supports
  * allow empty arguments to Table constructor
  * fix headless tables containing empty first row
  * add vertical tables
  * remove reference to require.paths
  * compact style for dense tables
  * fix toString without col widths by cloning array
  * [api]: Added abiltity to strip out ANSI color escape codes when calculating cell padding

0.0.1 / 2011-01-03 
==================

Initial release
