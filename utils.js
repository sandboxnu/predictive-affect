/* CONSTANTS */

const param = {};
param.img_x = 640;
param.img_y = 480;
param.grey_radius = 25;
param.display_time = 1.5;
param.fixation_time = 0.5;
param.trialsPerEncodingBlock = 144;
param.encodingBlocks = 1;

// Utilities for use in the html scripts
const neuImages = ['1908.jpg', '2101.jpg', '2191.jpg', '1945.jpg', '1390.jpg', '2520.jpg', '2107.jpg', '2393.jpg', '2484.jpg', '2597.jpg', '2020.jpg', '1903.jpg', '2309.jpg', '1645.jpg', '1114.jpg', '2635.jpg', '2272.jpg', '1302.jpg', '1122.jpg', '2383.jpg', '2359.jpg', '2840.jpg', '2575.jpg', '2122.jpg', '2890.jpg', '2220.jpg', '2411.jpg', '1617.jpg', '1670.jpg', '2384.jpg', '2749.jpg', '1935.jpg', '2279.jpg', '2397.jpg', '2210.jpg', '2377.jpg', '2579.jpg', '2458.jpg', '2445.jpg', '2308.jpg', '2446.jpg', '1560.jpg', '2032.jpg', '2206.jpg', '2221.jpg', '2752.jpg', '1947.jpg', '1931.jpg', '2435.jpg', '2102.jpg', '2235.jpg', '2396.jpg', '1230.jpg', '2215.jpg', '2695.jpg', '2745.1.jpg', '2521.jpg', '2870.jpg', '1726.jpg', '1350.jpg', '2704.jpg', '1820.jpg', '1675.jpg', '2606.jpg', '1616.jpg', '2770.jpg', '2850.jpg'];
const negImages = ['9909.jpg', '7380.jpg', '9530.jpg', '3261.jpg', '6315.jpg', '9571.jpg', '9412.jpg', '2456.jpg', '9220.jpg', '3019.jpg', '2352.2.jpg', '9187.jpg', '2811.jpg', '9006.jpg', '9183.jpg', '9927.jpg', '2688.jpg', '9414.jpg', '3350.jpg', '3212.jpg', '3001.jpg', '9280.jpg', '3170.jpg', '9140.jpg', '9181.jpg', '2301.jpg', '2799.jpg', '2800.jpg', '3230.jpg', '6312.jpg', '6821.jpg', '3550.1.jpg', '9043.jpg', '2683.jpg', '9561.jpg', '3300.jpg', '3053.jpg', '2053.jpg', '3180.jpg', '2751.jpg', '9600.jpg', '9570.jpg', '9295.jpg', '9410.jpg', '6825.jpg', '3195.jpg', '3160.jpg', '9342.jpg', '2345.1.jpg', '9810.jpg', '3064.jpg', '9265.jpg', '2141.jpg', '9185.jpg', '3120.jpg', '9413.jpg', '6563.jpg', '9325.jpg', '9635.1.jpg', '9041.jpg', '6243.jpg', '9921.jpg', '9831.jpg', '3015.jpg', '9560.jpg', '6571.jpg', '2710.jpg', '2205.jpg', '9415.jpg', '2900.jpg', '9520.jpg', '2730.jpg', '9424.jpg', '9800.jpg', '3400.jpg', '9301.jpg', '9332.jpg', '9075.jpg', '9254.jpg'];

/*
IMAGE OBJECTS
{
  fileName: String representing file name (without path),
  valence: 'B' or 'N',
  dotPlacement: 'right' or 'left',
}
*/

/**
 * Returns a random image with the given type, and mutates the list given to ensure that
 * the same image is not selected twice.
 * @param {*} type 'N' for a neutral image, 'B' for a negative one
 * @param {*} current a list of the currently used images
 */
const randomlySelectImage = (type, current) => {
  let ret = '';
  let firstPass = true;

  while (firstPass || current.includes(ret)) {
    firstPass = false;
    if (type === 'N') {
      ret = neuImages[Math.floor((Math.random() * neuImages.length))];
    } else if (type === 'B') {
      ret = negImages[Math.floor((Math.random() * negImages.length + 1))];
    } else {
      return Error(`randomlySelect only recieves types N and B, recieved ${type}`);
    }
  }
  if (typeof ret === 'undefined') {
    return randomlySelectImage(type, current);
  }
  current.push(ret);
  return ret;
};

/**
 * Returns one of the two arguments given, with a 50% probability of picking each one.
 * @param {*} one the first thing
 * @param {*} two the second thing
 */
const randomlyPickBetween = (one, two) => {
  const random = Math.random();
  return random <= 0.5 ? one : two;
};

/**
 * Picks randomly an element of the given list.
 * @param {*} list the list from which to pick
 */
const randomlyPickFromList = list => list[Math.floor(Math.random() * list.length)];

const getImagePath = ({ valence, fileName }) => `assets/stimuli/${valence === 'B' ? 'negative' : 'neutral'}/${fileName}`;

/**
 * Returns an html tag to display the image.
 * @param {*} type 'N' for a neutral image, 'B' for a negative one
 * @param {*} current a list of the currently used images
 */
const generateImageHTML = image => `
<div class="img-overlay-wrap">
<img src="${getImagePath(image)}">
<svg height="${param.img_y}" width="${param.img_x}">
  <circle cx="${image.greyDotX}" cy="${image.greyDotY}" r="${param.grey_radius}" fill="#696969" fill-opacity="0.75" />
</svg> 
</div>
`;

// N = neutral, B = negative
const tripletTypes = ['NNN', 'NNB', 'BNN', 'BBB'];

// current list of used stimuli
const currentList = [];

const removeElement = (array, element) => {
  for (let i = 0; i < array.length; i += 1) {
    if (array[i] === element) {
      return array.splice(i, 1);
    }
  }
  return null;
};

const isNegativeImg = ({ valence }) => (valence === 'B');

const copyImage = img => ({
  fileName: img.fileName,
  dotPlacement: img.dotPlacement,
  valence: img.valence,
  greyDotX: img.greyDotX,
  greyDotY: img.greyDotY,
});

const showFixationDot = (timeline) => {
  const whiteDot = {
    type: 'html-keyboard-response',
    stimulus: '<img class="white-dot" src="assets/whitedot.png" style="transform: scale(0.2, 0.2)">',
    trial_duration: 500,
    choices: jsPsych.NO_KEYS,
  };
  timeline.push(whiteDot);
};

const pickRandomBetween = (lower, upper) => {
  return Math.random() * (upper - lower) + lower;
}

/**
 * Exemplar is a set of 3 images also known as a triplet.
 */
class Exemplar {
  constructor(type) {
    this.type = type;
    this.images = [];
    this.populateImages();
  }

  copy() {
    if (this == null || typeof this !== 'object') return this;
    const copy = new Exemplar(this.type);
    for (let i = 0; i < 3; i += 1) {
      copy.images[i] = copyImage(this.getImage(i));
    }
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

  // TODO both these methods should copy
  getImages() {
    return this.images;
  }

  getImageNames() {
    return this.images.map(x => x.fileName);
  }

  populateImages() {
    const { type, images } = this;
    for (let charIndex = 0; charIndex < type.length; charIndex += 1) {
      const imgValence = type.charAt(charIndex);
      const dotSide = randomlyPickBetween('left', 'right');
      const image = {
        fileName: randomlySelectImage(imgValence, currentList),
        valence: imgValence,
        dotPlacement: dotSide,
        greyDotX: dotSide === 'left'
          ? pickRandomBetween(param.grey_radius, param.img_x / 2 - param.grey_radius)
          : pickRandomBetween(param.img_x / 2 + param.grey_radius, param.img_x - param.grey_radius),
        greyDotY: pickRandomBetween(param.grey_radius, param.img_y - param.grey_radius),
        positionInExemplar: charIndex,
      };
      images.push(image);
    }
  }
}

/*
Provided variable:
exemplars
  - object with string keys
  - keys are "NNN1", "NNN2", "NBB1", "NBB2", etc to match tripletTypes (2 per triplet)
*/
const exemplars = {};
for (let i = 0; i < tripletTypes.length; i += 1) {
  const type = tripletTypes[i];
  const exemplar1 = new Exemplar(type);
  const exemplar2 = new Exemplar(type);
  exemplars[`${type}1`] = exemplar1;
  exemplars[`${type}2`] = exemplar2;
}

const createExemplarCounts = () => {
  const exemplarCounts = {};
  for (let i = 0; i < tripletTypes.length; i += 1) {
    const type = tripletTypes[i];
    exemplarCounts[`${type}1`] = 6;
    exemplarCounts[`${type}2`] = 6;
  }
  return exemplarCounts;
};

// takes in exemplars and returns data nicely formatted for csv
const normalizeExemplars = (exmps) => {
  const data = [];
  Object.entries(exmps).forEach((exemplarEntry) => {
    const exemplar = exemplarEntry[1];
    exemplar.getImages().forEach((image) => {
      data.push({
        exemplarName: exemplarEntry[0],
        type: exemplar.type,
        ...image,
      });
    });
  });
  return data;
};

/**
 * Export modules for testing purposes
 */
if (typeof module !== 'undefined' && module.exports != null) {
  module.exports = {
    generateImageHTML,
    Exemplar,
    exemplars,
    getImagePath,
    createExemplarCounts,
    removeElement,
    randomlyPickFromList,
  };
}
