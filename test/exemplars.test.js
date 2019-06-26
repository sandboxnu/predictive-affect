const { describe, it } = global;
const assert = require("assert");
const jsdom = require("jsdom");
/* this weird stuff basically makes jsPsych testable in Node */
const { JSDOM } = jsdom;
const { window } = new JSDOM("<!DOCTYPE html><p>Hello world</p>");
global.window = window;
global.document = window.document;

const { populateExemplars, Exemplar } = require("../src/exemplars");
const paramSimple = {
  exemplarTypes: ['NNN', 'BBB', 'NNB', 'NBB'],
  numExemplarsPerType: 1
}
const exemplarsFromSimple = {
  NNN1: new Exemplar('NNN'),
  BBB1: new Exemplar('BBB'),
  NNB1: new Exemplar('NNB'),
  NBB1: new Exemplar('NBB'),
}
const paramLotsPerType = {
  exemplarTypes: ['NNN', 'BBB'],
  numExemplarsPerType: 17,
}

describe("Exemplars from simple param", () => {
  it("generates the correct number of exemplars", () => {
    const exemplars = populateExemplars(paramSimple);
    assert.equal(
      Object.keys(exemplars).length,
      paramSimple.exemplarTypes.length * paramSimple.numExemplarsPerType
    );
  });
  it("generates the correct exemplar types", () => {
    const exemplars = populateExemplars(paramSimple);
    assert.deepEqual(
      Object.keys(exemplars),
      Object.keys(exemplarsFromSimple)
    );
  });
  it("generates exemplars with information", () => {
    const exemplars = populateExemplars(paramSimple);
    assert.ok(exemplars.BBB1.getImages().length === 3);
    assert.ok(exemplars.NNN1.getImages().length === 3);
    assert.ok(exemplars.NNB1.getImages().length === 3);
    assert.ok(exemplars.NBB1.getImages().length === 3);
    assert.ok(exemplars.BBB1.type === 'BBB');
    assert.ok(exemplars.NNN1.type === 'NNN');
    assert.ok(exemplars.NNB1.type === 'NNB');
    assert.ok(exemplars.NBB1.type === 'NBB');
  });
});
