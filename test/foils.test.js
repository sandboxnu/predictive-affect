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
  numExemplarsPerType: 1,
  foilTestedOn: [1, 0, 0, 1],
  foilTestedType: [false, true, false, true]
}

const paramHalfRand = {
  exemplarTypes: ['NNN', 'rand_BBB', 'NNB', 'rand_NBB'],
  numExemplarsPerType: 1,
  foilTestedOn: [1, 0, 0, 1],
  foilTestedType: [false, true, false, true]
}

describe("Foil generation from simple params", () => {
  let exemplars, foils;
  before(() => {
    exemplars = populateExemplars(paramSimple);
    foils = createFoils(exemplars, paramSimple);
    randExemplars = populateExemplars(paramHalfRand)
    randFoils = createFoils(randExemplars, paramHalfRand);
  });

  it("creats the correct number of foils", () => {
    assert.equal(
      Object.keys(exemplars).length,
      Object.keys(foils).length
    );
  });

  it("creates foils that are not the same as exemplars", () => {
    assert.notDeepEqual(
      exemplars,
      foils
    );
  });
  it("creates unique foils", () => {
    for (let type of Object.keys(exemplars)) {
      exemplar = exemplars[type]
      foil = foils[type]
      assert.notDeepEqual(foil.getImages(), exemplar.getImages());
    }
  });
  it("creates foils of the proper length", () => {
    for (let foil of Object.values(foils)) {
      assert.equal(foil.getImages().length, 3);
    }
  });
  it("creates foils with the correct information in relation to the exemplars and params", () => {
    assert.ok(randFoils.BBB1.type === 'NBB');
    assert.ok(randFoils.NNN1.type === 'NNN');
    assert.ok(randFoils.NNB1.type === 'NNB');
    assert.ok(randFoils.NBB1.type === 'NNB');
    assert.ok(randExemplars.BBB1.type === 'BBB');
    assert.ok(randExemplars.NNN1.type === 'NNN');
    assert.ok(randExemplars.NNB1.type === 'NNB');
    assert.ok(randExemplars.NBB1.type === 'NBB');
  });
  it("preserves randomness", () => {
    assert.ok(randFoils.NNN1.isRand === false);
    assert.ok(randFoils.NNB1.isRand === false);
    assert.ok(randFoils.BBB1.isRand === true);
    assert.ok(randFoils.NBB1.isRand === true);
    assert.ok(randExemplars.NNN1.isRand === false);
    assert.ok(randExemplars.NNB1.isRand === false);
    assert.ok(randExemplars.BBB1.isRand === true);
    assert.ok(randExemplars.NBB1.isRand === true);
  });
});
