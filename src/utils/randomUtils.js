/**
 * Returns a random image with the given type, and mutates the list given to ensure that
 * the same image is not selected twice.
 * @param {*} type 'N' for a neutral image, 'B' for a negative one
 * @param {*} current a list of the currently used images
 */
const randomlySelectImage = (type, current) => {
  let ret = "";
  let firstPass = true;

  while (firstPass || current.includes(ret)) {
    firstPass = false;
    if (type === "N") {
      ret = neuImages[Math.floor(Math.random() * neuImages.length)];
    } else if (type === "B") {
      ret = negImages[Math.floor(Math.random() * negImages.length + 1)];
    } else {
      return Error(
        `randomlySelect only recieves types N and B, recieved ${type}`
      );
    }
  }
  if (typeof ret === "undefined") {
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
const randomlyPickFromList = list =>
  list[Math.floor(Math.random() * list.length)];

/**
 * Returns a random number between the two given numbers.
 * @param {*} lower the lower bound
 * @param {*} upper the upper bound
 */
const pickRandomBetween = (lower, upper) =>
  Math.random() * (upper - lower) + lower;

module.exports = {
  pickRandomBetween,
  randomlyPickFromList,
  randomlyPickBetween,
  randomlySelectImage
};
