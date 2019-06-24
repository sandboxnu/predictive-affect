const { describe, it } = global;
const assert = require("assert");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM("<!DOCTYPE html><p>Hello world</p>");
global.window = window;
global.document = window.document;

const { populateExemplars } = require("../src/exemplars");
const { param } = require("../src/param");

describe("Exemplar", () => {
  it("generates the correct number of exemplars based on params", () => {
    const exemplars = populateExemplars();
    console.log(exemplars)
    console.log(param)
    assert.equal(
      Object.keys(exemplars).length,
      param.exemplarTypes.length * param.numExemplarsPerType
    );
  });
});
