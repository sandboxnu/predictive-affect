const { describe, it, before } = global;
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
  BBB1: new Exemplar('rand_BBB'),
  NNB1: new Exemplar('NNB'),
  NBB1: new Exemplar('rand_NBB'),
}
const paramLotsPerType = {
  exemplarTypes: ['NNN', 'BBB'],
  numExemplarsPerType: 13,
}

describe("Exemplars from simple param", () => {
  let exemplars;
  before(() => {
    exemplars = populateExemplars(paramSimple);
  });

  it("generates the correct number of exemplars", () => {
    assert.equal(
      Object.keys(exemplars).length,
      paramSimple.exemplarTypes.length * paramSimple.numExemplarsPerType
    );
  });
  it("generates the correct exemplar types", () => {
    assert.deepEqual(
      Object.keys(exemplars),
      Object.keys(exemplarsFromSimple)
    );
  });
  it("generates exemplars with information", () => {
    assert.ok(exemplars.BBB1.getImages().length === 3);
    assert.ok(exemplars.NNN1.getImages().length === 3);
    assert.ok(exemplars.NNB1.getImages().length === 3);
    assert.ok(exemplars.NBB1.getImages().length === 3);
    assert.ok(exemplars.BBB1.type === 'BBB');
    assert.ok(exemplars.NNN1.type === 'NNN');
    assert.ok(exemplars.NNB1.type === 'NNB');
    assert.ok(exemplars.NBB1.type === 'NBB');
    assert.ok(exemplars.NNN1.isRand === false);
    assert.ok(exemplars.NNB1.isRand === false);
    assert.ok(exemplars.BBB1.isRand === true);
    assert.ok(exemplars.NBB1.isRand === true);

  });
});

describe('Exemplars from many-per-type param', () => {
  let exemplars;
  before(() => {
    exemplars = populateExemplars(paramLotsPerType);
  });
  it("generates the correct amount of exemplars", () => {
    assert.equal(Object.keys(exemplars).length, paramLotsPerType.numExemplarsPerType * 2);
  });
  it("generates the correct exemplar types", () => {
    for (let i = 1; i < paramLotsPerType.numExemplarsPerType; i += 1) {
      assert(Object.keys(exemplars).includes(`NNN${i}`))
    }
    for (let i = 1; i < paramLotsPerType.numExemplarsPerType; i += 1) {
      assert(Object.keys(exemplars).includes(`BBB${i}`))
    }
  });
  it("generates exemplars with information", () => {
    for (let exemplar of Object.values(exemplars)) {
      assert.equal(exemplar.getImages().length, 3);
    }
  });
});
