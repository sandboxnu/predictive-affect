const param = {};
param.randomTriplets = false; /* false if the images in the triplets are in the same order every
                                 block/phase, true if they are randomly shuffled before appearing */
param.exemplarTypes = ["NNN", "NNB", "BNN", "BBB"]; // the different types of exemplar. these can be triplets, pairs, etc NNN, NNB, BNN, or BBB
param.numExemplarsPerType = 2; // number of exemplars per type (see exemplarTypes variable)
param.imageStructLength = (
  param.exemplarTypes[0] || []
).length; /* INVARIANT the exemplarTypes are assumed to be the same length */
param.img_x = 640; // width of image
param.img_y = 480; // height of image
param.grey_radius = 25; // radius of grey dot
param.display_time = 1.5; // time in seconds to display encoding trial
param.fixation_time = 0.5; // time in seconds to display fixation trial
param.break_duration = 60; // time in seconds to have a break between blocks
param.encodingBlocks = 6; // number of encoding blocks
param.repPerBlock = 6; // number of repetitions per exemplar encoding block
param.trialsPerEncodingBlock =
  param.exemplarTypes.reduce((acc, t) => acc + t.length, 0) *
  param.repPerBlock *
  param.exemplarTypes.length; // total number of trials per block
param.foilTestedOn = [
  0,
  2,
  0,
  2,
  2,
  2,
  0,
  0
]; /* for every exemplar, the index of the image which the foil is
      different from the original triplet */
param.foilTestedType = [
  false,
  true,
  false,
  true,
  true,
  false,
  true,
  false,
]; /* for every exemplar, whether the replaced image in the foil is the same affect as the image it replaces. */
param.completionCode = Math.floor(Math.random() * 1000000000);

if (param.foilTestedOn.length !== param.exemplarTypes.length * param.numExemplarsPerType) {
  throw new Error(
    "param.foilTestedOn and param.exemplarTypes match up by position, so they must be the same length."
  );
}

if (param.foilTestedOn.length !== param.exemplarTypes.length * param.numExemplarsPerType) {
  throw new Error(
    "param.foilTestedType and param.exemplarTypes match up by position, so they must be the same length."
  );
}

module.exports = param;
