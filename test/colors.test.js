var assert = require('assert');
var Table = require('../');

var table = new Table({
  head: ['Name', 'Description']
});

// Check if `colors.js` was loaded to the current execution context
function isColorsModuleLoaded() {
  var colorsPath = /colors.js/;
  var loadedModules = Object.keys(require('module')._cache).join(',');
  
  return colorsPath.test(loadedModules);
}

module.exports = {
  'test optional colors feature': function (){
    table.options.shouldDisableColors = true;
    table.push(['Foo', 'Lorem Ipsum']);
    table.toString();   

    // should only load `colors.js` if `shouldDisableColors = false`
    assert(!isColorsModuleLoaded());
  }
};
