var assert = require('assert');
let utils = require('../utils.js')


describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});



describe('test', function() {
    describe('te', function() {
      it('shouaer', function(){
        assert.equal(utils.generateImageHTML(utils.exemplars['NNN1'].images[0]),
 `<img class="stimulus-image" src="${utils.getImagePath(utils.exemplars['NNN1'].images[0])}" style="max-width:75%;">`)
      });
    });
  });