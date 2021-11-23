/**
 * Module requirements.
 */

require('should');

var { strlen } = require('../lib/utils');

/**
 * Tests.
 */


 module.exports = {
    'test strlen with string argument': function() {
        strlen('hello\nme').should.equal(5);
    },
    'test strlen with number argument': function() {
        strlen(5).should.equal(1);
    },
 }