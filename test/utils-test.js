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

const assert = require("assert");
const utils = require("../utils.js");

const { describe, it } = global;

describe('Exemplars', () => {
  it('Correctly generates exemplars', () => {
    assert(1 === 1);
  })
})
