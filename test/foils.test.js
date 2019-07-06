const { describe, it, before } = global;
const assert = require("assert");
const jsdom = require("jsdom");
/* this weird stuff basically makes jsPsych testable in Node */
const { JSDOM } = jsdom;
const { window } = new JSDOM("<!DOCTYPE html><p>Hello world</p>");
global.window = window;
global.document = window.document;

const { populateExemplars} = require("../src/exemplars");
const { createFoils} = require("../src/foils");

const paramSimple = {
  exemplarTypes: ['NNN', 'BBB', 'NNB', 'NBB'],
  numExemplarsPerType: 1
}

const paramHalfRand = {
  exemplarTypes: ['NNN', 'rand_BBB', 'NNB', 'rand_NBB'],
  numExemplarsPerType: 1
}

describe("Foil from simple params", () => {
  let exemplars, foils;
  before(() => {
    exemplars = populateExemplars(paramSimple);
    foils = createFoils(exemplars);
    randExemplars = populateExemplars(paramHalfRand)
    randFoils = createFoils(randExemplars);
  });

  it("created the correct number of foils", () => {
    assert.equal(
      Object.keys(exemplars).length,
      Object.keys(foils).length
    );
  });

  it("is not the same as exemplars", () => {
    assert.notDeepEqual(
      exemplars,
      foils
    );
  });
  it("Creates unique foils", () => {
    for (let type of Object.keys(exemplars)) {
      exemplar = exemplars[type]
      foil = foils[type]
      assert.notDeepEqual(foil.getImages(), exemplar.getImages());
    }
  });
  it("Creates foils of the proper length", () => {
    for (let foil of Object.values(foils)) {
      assert.equal(foil.getImages().length, 3);
    }
  });
  it("generates foils with the correct information in relation to the exemplars", () => {
    assert.ok(randFoils.BBB1.type !== 'BBB');
    assert.ok(randFoils.NNN1.type === 'NNN');
    assert.ok(randFoils.NNB1.type === 'NNB');
    assert.ok(randFoils.NBB1.type !== 'NBB');
    assert.ok(randFoils.NNN1.isRand === false);
    assert.ok(randFoils.NNB1.isRand === false);
    assert.ok(randFoils.BBB1.isRand === true);
    assert.ok(randFoils.NBB1.isRand === true);
    assert.ok(randExemplars.BBB1.type === 'BBB');
    assert.ok(randExemplars.NNN1.type === 'NNN');
    assert.ok(randExemplars.NNB1.type === 'NNB');
    assert.ok(randExemplars.NBB1.type === 'NBB');
    assert.ok(randExemplars.NNN1.isRand === false);
    assert.ok(randExemplars.NNB1.isRand === false);
    assert.ok(randExemplars.BBB1.isRand === true);
    assert.ok(randExemplars.NBB1.isRand === true);
  });
});
