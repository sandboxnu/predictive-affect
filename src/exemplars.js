const { param } = require("./param");
const { copyImage } = require("./utils/imageUtils");
const {
  randomlyPickFromList,
  pickRandomBetween,
  randomlySelectImage
} = require("./utils/randomUtils");

/**
 * Exemplar is a set of n images.
 */
class Exemplar {
  constructor(type) {
    this.type = type;
    this.images = [];
    this.isRand = type.startsWith("rand_");
    this.type = type.replace("rand_", "");
    this.populateImages();
  }

  copy() {
    if (this == null || typeof this !== "object") return this;
    const copy = new Exemplar(this.type);
    copy.images = [];
    copy.isRand = this.isRand;
    this.getImages().forEach(image => {
      copy.images.push(copyImage(image));
    });
    return copy;
  }

  changeImageAt(index, img) {
    this.images[index] = img;
  }

  /**
   * Gets the image at index i
   * @param {*} index which image to select
   * @returns the Image object
   */
  getImage(index) {
    return this.images[index];
  }

  getImages() {
    return (param.randomTriplets || this.isRand)
      ? this.images.slice().sort( () => Math.random() - 0.5)
      : [...this.images];
  }

  getImageNames() {
    return this.images.map(x => x.fileName);
  }

  populateImages() {
    const { type, images } = this;
    for (let charIndex = 0; charIndex < type.length; charIndex += 1) {
      const imgValence = type.charAt(charIndex);
      const dotSide = randomlyPickFromList(dotSides);
      const image = {
        fileName: randomlySelectImage(imgValence, currentList),
        valence: imgValence,
        dotPlacement: dotSide,
        greyDotX:
          dotSide === "left"
            ? pickRandomBetween(
                param.grey_radius,
                param.img_x / 2 - param.grey_radius
              )
            : pickRandomBetween(
                param.img_x / 2 + param.grey_radius,
                param.img_x - param.grey_radius
              ),
        greyDotY: pickRandomBetween(
          param.grey_radius,
          param.img_y - param.grey_radius
        ),
        positionInExemplar: charIndex
      };
      images.push(image);
    }
  }
}

/* EXEMPLARS */

// current list of used stimuli
const currentList = [];

// current sides of grey dots, for counterbalancing
const dotSides = [];
// trials per block / repeats of each image per block = # images per block
for (let i = 0; i < param.trialsPerEncodingBlock / param.repPerBlock; i += 1) {
  // add an even amount of 'left'/'right' to the list, equal to the amount of images
  dotSides.push(i % 2 === 0 ? "left" : "right");
}

/*
Provided variables:
exemplars:
  - object with string keys
  - keys are "NNN", "BBB", etc to match each unique type in param.exemplarTypes
  - values are arrays of each exemplar per type
exemplars
  - object with string keys
  - keys are "NNN1", "NNN2", "NBB1", "NBB2", "NBB3", etc to match param.exemplarTypes
  - values are exemplar objects
*/

const populateExemplars = (param = {}, exemplars = {}) => {
  const denormalizedExemplars = {};

  const totalExemplarsCount = param.exemplarTypes.length * param.numExemplarsPerType;
  for (let i = 0; i < totalExemplarsCount; i += 1) {
    const type = param.exemplarTypes[i % param.exemplarTypes.length];
    const nonRandomType = type.replace("rand_", "")
    if (!Array.isArray(denormalizedExemplars[nonRandomType]))
      denormalizedExemplars[nonRandomType] = [];
    denormalizedExemplars[nonRandomType].push(new Exemplar(type));
  }
  Object.keys(denormalizedExemplars).forEach(type => {
    for (let i = 1; i <= denormalizedExemplars[type].length; i += 1) {
      exemplars[`${type}${i}`] = denormalizedExemplars[type][i - 1];
    }
  });

  return exemplars;
};

const exemplars = populateExemplars(param);

const createExemplarCounts = curExemplars => {
  const exemplarCounts = {};
  Object.keys(curExemplars).forEach(name => {
    exemplarCounts[name] = param.repPerBlock;
  });
  return exemplarCounts;
};

// takes in exemplars and returns data nicely formatted for csv
const normalizeExemplars = exmps => {
  const data = [];
  Object.entries(exmps).forEach(exemplarEntry => {
    const exemplar = exemplarEntry[1];
    exemplar.getImages().forEach(image => {
      data.push({
        exemplarName: exemplarEntry[0],
        type: exemplar.type,
        ...image
      });
    });
  });
  return data;
};

module.exports = {
  Exemplar,
  normalizeExemplars,
  createExemplarCounts,
  populateExemplars,
  exemplars
};
