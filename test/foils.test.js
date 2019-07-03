const { describe, it, before } = global;
const assert = require("assert");
const jsdom = require("jsdom");
/* this weird stuff basically makes jsPsych testable in Node */
const { JSDOM } = jsdom;
const { window } = new JSDOM("<!DOCTYPE html><p>Hello world</p>");
global.window = window;
global.document = window.document;

const { populateExemplars, Exemplar } = require("../src/exemplars");
const { createFoils, getFoil} = require("../src/foils");

const paramSimple = {
  exemplarTypes: ['NNN', 'BBB', 'NNB', 'NBB'],
  numExemplarsPerType: 1
}

const paramLotsPerType = {
  exemplarTypes: ['NNN', 'BBB'],
  numExemplarsPerType: 13,
}

const exemplarsFromSimple = {
  NNN1: new Exemplar('NNN'),
  BBB1: new Exemplar('BBB'),
  NNB1: new Exemplar('NNB'),
  NBB1: new Exemplar('NBB'),
}

const halfRandExemplars = {
  NNN1: new Exemplar('NNN'),
  BBB1: new Exemplar('rand_BBB'),
  NNB1: new Exemplar('NNB'),
  NBB1: new Exemplar('rand_NBB'),
}

describe("Foils from simple params", () => {
  let exemplars, foils;
  before(() => {
    exemplars = populateExemplars(paramSimple);
    foils = createFoils(exemplars);
  });

  it("created the correct number of foils", () => {
    assert.equal(
      Object.keys(exemplars).length,
      Object.keys(foils).length
    );
  });

  it("Created unique foils", () => {
    assert.notDeepEqual(
      exemplars,
      foils
    );
  });
});
