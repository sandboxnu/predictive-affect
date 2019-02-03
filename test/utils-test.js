/**
 * Testings for ../utils.js file.
 * Used this [tutorial](https://codeburst.io/how-to-test-javascript-with-mocha-part-2-2d83fcb6101a)
 * 
 * Steps to test:
 *  1. Add the necessary modules and functions to test to 
 *     the <code>module.exports</code> array at the bottom of utils.js
 *  2. Write the following tests like below.
 *  3. Run <code>npm test</code>.
 *   
 */

var assert = require('assert');
let utils = require('../utils.js')



describe('Image testing', function() {
  describe('GeneratingImageHTML test', function() {
    const exemplar0 = new utils.Exemplar('NNN');
    exemplar0.images[0].fileName = '2101.jpg';
    const image0 = exemplar0.images[0];
    it('This is a test that basically has copy and pasted code.', function(){
      assert.equal(utils.generateImageHTML(image0),
      `<img class="stimulus-image" src="assets/stimuli/neutral/2101.jpg" style="max-width:75%;">`)
    });
    it('This is a test that basically has copy and pasted code.', function(){
      assert.equal(utils.generateImageHTML(utils.exemplars['NNN1'].images[0]),
      `<img class="stimulus-image" src="${utils.getImagePath(utils.exemplars['NNN1'].images[0])}" style="max-width:75%;">`)
    });

    it('This is a test that basically has copy and pasted code.', function(){
      assert.equal(utils.generateImageHTML(utils.exemplars['NNN1'].images[0]),
      `<img class="stimulus-image" src="${utils.getImagePath(utils.exemplars['NNN1'].images[0])}" style="max-width:75%;">`)
    });
  });
});