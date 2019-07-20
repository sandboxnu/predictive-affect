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

const paramLotsPerType = {
  exemplarTypes: ['NNN', 'BBB'],
  foilTestedOn: [1, 0, 1, 0, 0, 0, 0, 1, 2, 2, 0, 1, 2, 1, 0, 1, 0, 0, 0, 0],
  numExemplarsPerType: 10,
  foilTestedType: [false, false, false, true, true, true, false, true, false, true, true, true, false, true, false, false, false, true, false, true]
}

const paramTiny = {
  exemplarTypes: ['NNN'],
  foilTestedOn: [1],
  numExemplarsPerType: 1,
  foilTestedType: [false]
}

describe("Foil generation from simple params", () => {
  let exemplars, foils, randExemplars, randFoils;
  before(() => {
    exemplars = populateExemplars(paramSimple);
    foils = createFoils(exemplars, paramSimple);
    randExemplars = populateExemplars(paramHalfRand);
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
      exemplar = exemplars[type];
      foil = foils[type];
      assert.notDeepEqual(foil.getImages(), exemplar.getImages());
    }
  });
  it("creates foils that are only different by one image", () => {
    for (let type of Object.keys(exemplars)) {
      exemplarImages = exemplars[type].getImageNames();
      foilImages = foils[type].getImageNames();
      sameImages = exemplarImages.filter(image => foilImages.includes(image));
      assert.equal(sameImages.length, 2);
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
describe("Foil generation from many per type param", () => {
  let manyExemplars, manyFoils;
  before(() => {
    manyExemplars = populateExemplars(paramLotsPerType);
    manyFoils = createFoils(manyExemplars, paramLotsPerType);
  });
  it("creats the correct number of foils", () => {
    assert.equal(
      Object.keys(manyExemplars).length,
      Object.keys(manyFoils).length
    );
  });
  it("creates foils that are only different by one image", () => {
    for (let type of Object.keys(manyExemplars)) {
      exemplarImages = manyExemplars[type].getImageNames();
      foilImages = manyFoils[type].getImageNames();
      sameImages = exemplarImages.filter(image => foilImages.includes(image));
      assert.equal(sameImages.length, 2);
    }
  });
});
describe("Foil generation from tiny param", () => {
  let tinyExemplars, tinyFoils;
  before(() => {
    tinyExemplars = populateExemplars(paramTiny);
    tinyFoils = createFoils(tinyExemplars, paramTiny);
  });
  it("creats the correct number of foils", () => {
    assert.equal(
      Object.keys(tinyExemplars).length,
      Object.keys(tinyFoils).length
    );
  });
  it("creates foils that are only different by one image", () => {
    for (let type of Object.keys(tinyExemplars)) {
      exemplarImages = tinyExemplars[type].getImageNames();
      foilImages = tinyFoils[type].getImageNames();
      sameImages = exemplarImages.filter(image => foilImages.includes(image));
      assert.equal(sameImages.length, 2);
    }
  });
});
