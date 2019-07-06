const { param } = require("./param");
const { exemplars } = require("./exemplars");
const {
  neuImages,
  negImages
} = require("./utils/imageUtils");

// creates a random foil for a single exemplar
const createFoil = (curTrip, i, param) => {
  let result = curTrip.copy();
  let numImageTested = param["foilTestedOn"][i];
  const typeTested = param["foilTestedType"][i];
  const curType = curTrip.getImage(numImageTested).valence;

  const foilType = curType === "N" ? "B" : "N";
  var newType = typeTested ? foilType : curType;

  const imgs = newType === "N" ? neuImages.slice() : negImages.slice();

  var newImg;
  var newFile = result.getImage(0).fileName;

  while (curTrip.getImageNames().includes(newFile)) {
    newFile = imgs[Math.floor(Math.random() * imgs.length)];
  }

  newImg = { fileName: newFile, dotPlacement: "N/A: foil", valence: newType };
  result.type =
    result.type.slice(0, numImageTested) +
    newType +
    result.type.slice(numImageTested + 1);
  result.changeImageAt(numImageTested, newImg);

  return result;
};

// creates a foil for every exemplar
const createFoils = (exemplars, param) => {
  var result = [];
  var count = 0;
  for (let i in exemplars) {
    result[i] = createFoil(exemplars[i], count, param);
    count++;
  }
  return result;
};

var foils = createFoils(exemplars, param);

// returns the foil of the given triplet
const getFoil = (correctTriplet, i) => {
  return foils[i];
};

module.exports = {
  createFoils,
  getFoil
};
