const jsPsych = require("jspsych");
const { saveJsPsychFilesAsZip } = require("./utils/fileUtils");
const {
  generateImageHTML,
  generateImageHTMLNoDot,
  showFixationDot,
  showIntertrialBreak,
  isNegativeImg
} = require("./utils/imageUtils");
const {
  randomlyPickFromList,
  randomlyPickBetween
} = require("./utils/randomUtils");
const {
  exemplars,
  createExemplarCounts,
  normalizeExemplars
} = require("./exemplars");
const {
  getFoil
} = require("./foils");
const param = require("param");

const timeline = [];

// BEGIN INSTRUCTIONS

const participantId = {
  type: "survey-text",
  questions: [{ prompt: "Please enter your subject ID." }],
  on_finish: function(data) {
    param.participantId = JSON.parse(data.responses).Q0;
  }
};

const qToQuit = function() {
  window.addEventListener(
    "keydown",
    event => event.keyCode === 81 && jsPsych.endExperiment("You have chosen to leave the experiment.")
  );
};

const qQuit = {
  type: "call-function",
  func: qToQuit
};

timeline.push(participantId);
timeline.push(qQuit);

const encodingInstructionsPanel1 = {
  type: "html-keyboard-response",
  stimulus:
    '<p>In the first part of the experiment, a series of images will appear on the screen, one after the other.</p><p>These images will have a grey patch on them.</p><p>If you see a grey patch on the left side of the picture, please press the button "J" as quickly as possible. If you see a grey patch on the right side of the picture, please press the button “K” as quickly as possible.</p><p>Please make sure you always use the same fingers to press the buttons. </p><p>You will see many images, so we will give you breaks periodically.</p><p>If at any point of this part of the experiment that you want to quit, please press "Q".</p><p>To continue, please press "K".</p>',
  choices: ["k"]
};

const practiceImageLeft1 = {
  fileName: "sample0.jpg",
  valence: "S",
  greyDotX: 150,
  greyDotY: 240,
  dotPlacement: "left"
};

const practiceImageRight = {
  fileName: "sample1.jpg",
  valence: "S",
  greyDotX: 450,
  greyDotY: 240,
  dotPlacement: "right"
};

const practiceImageLeft2 = {
  fileName: "sample2.jpg",
  valence: "S",
  greyDotX: 150,
  greyDotY: 240,
  dotPlacement: "left"
};

const encodingInstructionsPanel2 = {
  type: "html-keyboard-response",
  stimulus:
    generateImageHTMLNoDot(practiceImageLeft1) +
    '<p>This is an example of the image with a grey patch on the left side.</p><p>You should press "J" as soon as you find it.</p><p>To see another example, please press "J".</p>',
  choices: ["j"]
};
const encodingInstructionsPanel3 = {
  type: "html-keyboard-response",
  stimulus:
    generateImageHTMLNoDot(practiceImageRight) +
    '<p>This is an example of the image with a grey patch on the right side.</p><p>You should press "K" as soon as you find it.</p><p>To see another example, please press "K".</p>',
  choices: ["k"]
};
const encodingInstructionsPanel4 = {
  type: "html-keyboard-response",
  stimulus:
    generateImageHTMLNoDot(practiceImageLeft2) +
    '<p>This is an example of the image with a grey patch on the left side.</p><p>You should press "J" as soon as you find it.</p><p>To start the experiment, please press "J".</p><p>To see the instructions again, please press "F".</p>',
  choices: ["j", "f"]
};
const loopNode = {
  timeline: [
    encodingInstructionsPanel1,
    encodingInstructionsPanel2,
    encodingInstructionsPanel3,
    encodingInstructionsPanel4
  ],
  loop_function: data => {
    if (
      jsPsych.pluginAPI.convertKeyCharacterToKeyCode("f") ==
      data.values()[3].key_press
    ) {
      return true;
    } else {
      return false;
    }
  }
};

timeline.push(loopNode);
// END INSTRUCTIONS

// CREATE TIMELINE

const removeElement = (array, element) => array.filter(e => e !== element);

for (let block = 0; block < param["encodingBlocks"]; block += 1) {
  let exemplarCounts = createExemplarCounts(exemplars);
  let exemplarNames = Object.keys(exemplarCounts);
  for (
    let trial = 0;
    trial < param["trialsPerEncodingBlock"] / param["imageStructLength"];
    trial += 1
  ) {
    // SELECT AN EXEMPLAR
    const curExemplar = randomlyPickFromList(exemplarNames);
    exemplarCounts[curExemplar] -= 1;
    if (exemplarCounts[curExemplar] === 0) {
      exemplarNames = removeElement(exemplarNames, curExemplar);
    }
    // DISPLAY ITS IMAGES
    for (
      let subTrial = 0;
      subTrial < exemplars[curExemplar].getImages().length;
      subTrial += 1
    ) {
      showFixationDot(timeline);
      const image = exemplars[curExemplar].getImage(subTrial);
      const saveTrial = trial;
      const curTrial = {
        type: "html-keyboard-response",
        stimulus: generateImageHTML(image),
        choices: ["j", "k"],
        trial_duration: param["display_time"] * 1000,
        response_ends_trial: false,
        on_finish: data => {
          data.participantId = param.participantId;
          data.tripletType = exemplars[curExemplar].type;
          data.tripletImages = exemplars[curExemplar]
            .getImages()
            .map(img => img.fileName);
          data.trialType = "encoding";
          data.imageAffect = image.valence;
          data.hasGreyDot = true;
          data.positionInExemplar = image.positionInExemplar;
          data.imageFile = image.fileName;
          data.trialNumber = saveTrial;
          data.greyDotX = image.greyDotX;
          data.greyDotY = image.greyDotY;
          data.key_press = jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(
            data.key_press
          );
          let key = data.key_press;
          data.isCorrect =
            (key === "j" && image.dotPlacement === "left") ||
            (key === "k" && image.dotPlacement === "right")
              ? 1
              : 0;
        }
      };
      timeline.push(curTrial);
      trial += 1;
    }
  }
  if (block != param["encodingBlocks"] - 1) {
    showIntertrialBreak(timeline, block);
  }
}

// END ENCODING

const testingInstructions = {
  type: "instructions",
  pages: [
    `<div><p>In this part of the experiment, you will see two groups of images: Group A and Group B. Each group includes ${
      param["imageStructLength"]
    } images, which will appear one after the other.</p> <p>Your job is to indicate which group looks most familiar. Please pay close attention when the images are shown, as they will not be repeated.</p> <p>First, we will show you Groups A and B. After seeing all groups, you will decide which group looks most familiar.</p><p>To start the experiment, please press "J".</p><p>To see the instructions again, please press "F".</p></div>`
  ],
  key_forward: "j"
};

timeline.push(testingInstructions);

// displys the instructions and three images for a given triplet
const displayTriplet = (trip, ordering) => {
  const instructText =
    "<div> <p> To see Group " +
    ordering +
    ", please press “J”. Three images will appear, one after the other.</p> </div>";

  const tripletInstructions = {
    type: "instructions",
    pages: [instructText],
    key_forward: "j"
  };

  timeline.push(tripletInstructions);

  for (let i = 0; i < param["imageStructLength"]; i++) {
    const img = trip.getImage(i);
    showFixationDot(timeline);

    const imagePrompt = {
      type: "html-keyboard-response",
      stimulus: generateImageHTMLNoDot(img),
      choices: jsPsych.NO_KEYS,
      trial_duration: 1000
    };

    timeline.push(imagePrompt);
  }
};

// asks the user what the correct triplet is
const promptCorrectTrip = (tripA, tripB, ordering) => {
  var foilDif = 0;
  var sameCat = false;
  // var foil = tripA.getImages().slice();
  // var correct = tripA.getImages().slice();
  const promptText =
    '<div><p>Using the keyboard, if the image sequence in Option A looked more familiar, press “A”.</p><p>If the image sequence in Option B looked more familiar, press “B”.</p> <p>To continue, press "Enter".</p></div>';

  for (let i = 0; i < param["imageStructLength"]; i++) {
    if (tripA.getImage(i).fileName != tripB.getImage(i).fileName) {
      foilDif = i + 1;
      if (
        isNegativeImg(tripA.getImage(i)) === isNegativeImg(tripB.getImage(i))
      ) {
        sameCat = true;
      }
    }
  }

  const askPrompt = {
    type: "html-keyboard-response",
    stimulus: promptText,
    choices: ["a", "b"],
    data: {
      participantId: param.participantId,
      trialType: "testing",
      "triplet ordering": ordering,
      "foil difference": foilDif,
      "same category tested": sameCat,
      "first option": tripA.getImageNames(),
      "second option": tripB.getImageNames()
    },
    on_finish: function(data) {
      if (
        (ordering[0] == "correct" &&
          data.key_press ==
            jsPsych.pluginAPI.convertKeyCharacterToKeyCode("a")) ||
        (ordering[0] == "incorrect" &&
          data.key_press == jsPsych.pluginAPI.convertKeyCharacterToKeyCode("b"))
      ) {
        data.correct = 2;
      } else {
        data.correct = sameCat ? 1 : 0;
      }
      data["key press"] = jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(
        data.key_press
      );
    }
  };

  const textPrompt = {
    type: "instructions",
    pages: [promptText],
    key_forward: "enter"
  };

  timeline.push(askPrompt);
  timeline.push(textPrompt);
};

// for every exemplar, display the exemplar and foil
for (let i in exemplars) {
  const curTriplet = exemplars[i];
  const foil = getFoil(curTriplet, i);
  const ordering = randomlyPickBetween(
    ["correct", "foil"],
    ["foil", "correct"]
  );

  const tripA = ordering[0] === "correct" ? curTriplet : foil;
  const tripB = tripA === curTriplet ? foil : curTriplet;

  displayTriplet(tripA, "A");
  displayTriplet(tripB, "B");
  promptCorrectTrip(tripA, tripB, ordering);
}

const testingFinish = {
  type: "instructions",
  pages: [
    '<div> <p> Thank you for finishing this part of the experiment. </p> <p>To continue, press "J".</p></div>'
  ],
  key_forward: "j"
};

timeline.push(testingFinish);

// END TESTING

let ratingInstructions = [
  [
    'For this part of the experiment, we will show you the images you saw earlier.\n\nFor each image, you will rate how it made you feel.\n\nNote that you will not be able to quit the experiment during this part of the experiment. If you do not wish to continue, please press “Q” to quit now.\n\nTo continue, please press "J".'
  ],
  [
    'First, you will rate whether the image made you feel pleasant or unpleasant. In other words, we want you to rate your emotional feelings: whether you felt positive/pleasant/good, or negative/unpleasant/bad.\n\nSecond, you will rate whether the image made you feel activated or deactivated. In other words, we want you to rate the physical feelings in your body: whether you felt activated/excited/worked-up, or deactivated/tired/bored.\n\nWe will show you both of the scales and provide some more examples.\n\nTo continue, please press "J".'
  ],
  [
    'For each image, you will use the icons below to answer how pleasant or unpleasant the image made you feel. This is a rating of your emotional feelings.\n\nIf the image made you feel negative or unpleasant, then you should select icons on the left side of the scale.\n\nIf the image made you feel positive or pleasant, then you should select icons on the right side of the scale.\n\nIf the image made you feel very little or no emotion, then you should select icons around the middle of the scale.\n\nTo continue, please press "J".'
  ],
  [
    'For each image, you will also rate how activated or deactivated the image made you feel. This is a rating of the physical feelings in your body.\n\nThink of when you feel most deactivated, like right before you fall asleep, or when you feel calm, depressed, or bored. If the image made you feel this way, then you should select icons on the left side of the scale.\n\nThink of when you feel most activated, like when you have run up a flight of stairs, had many cups of coffee, or feel excited, angry, or afraid. If the image made you feel this way, then you should select icons on the right side of the scale.\n\nThink of when you have felt awake but not too worked up, like when you are doing something engaging but not too activating, e.g. chores around the house. If the image made you feel this way, then you should select icons around the middle of the scale.\n\nTo continue, please press "J".'
  ],
  [
    'We will show you images in a moment. For each, you will rate your emotional feeling (unpleasant–pleasant) and the physical feelings in your body (deactivated–activated).\n\nBoth scales will appear beneath the image. Please select an icon for both.\n\nAfter selecting both ratings, press "Enter" or "Return" to continue to the next trial.\n\nPlease note that you will not be able to quit during this part of the experiment. If you do not wish to continue, please press "Q" to quit now.\n\nTo start the experiment, please press "J".\nTo see the instructions again, please press "F".'
  ]
];

timeline.push({
  type: "instructions",
  pages: ratingInstructions,
  key_forward: "j",
  allow_backward: true,
  key_backward: "f"
});

var allImagesShown = [];

Object.keys(exemplars).forEach(name => {
  allImagesShown = allImagesShown.concat(exemplars[name].getImages());
});

allImagesShown.forEach(function(image) {
  const trial = {
    type: "html-double-slider-response",
    min: [0, 0],
    start: [4, 4],
    max: [8, 8],
    stimuli: [generateImageHTMLNoDot(image), ""],
    step: [1, 1],
    labels: [],
    slider_count: 2,
    prompt: [
      "<p>What Valence level would you rate this image?</p>",
      "<p>What level of arousal would you rate this image?</p>"
    ],
    on_finish: data => {
      data.participantId = param.participantId;
      data.Valence = data.responses[0];
      data.Arousal = data.responses[1];
      data.ImageName = image.fileName;
      data.TrialType = "rating";
    }
  };
  const arousalpics = [];

  for (let i = 0; i < 9; i++) {
    let callToSetSliderOnClick = `(() => {document.getElementById('jspsych-html-slider-response-response-0').value = ${i}; })();`;
    arousalpics.push(
      `<img onclick="${callToSetSliderOnClick}" src="assets/stimuli/scale/arousal/arousal${i}.png" style="max-width:80%; ">`
    ); //filter: invert(100%);
  }
  trial.labels.push(arousalpics);
  const valencepics = [];
  for (let i = 0; i < 9; i++) {
    // let callToSetSliderOnClick = `(() => {document.getElementById('jspsych-html-slider-response-response-1').value = ${i}; })();`;
    valencepics.push(
      `<img src="assets/stimuli/scale/valence/valence${i}.png" style="max-width:80%; ">`
    );
  }
  trial.labels.push(valencepics);
  timeline.push(trial);
});

const completionCode = {
  type: "instructions",
  pages: [
    "<div><p>Your MTurk completetion code is " +
      param.completionCode
  ],
  key_forward: "rightarrow"
};

const download = {
  type: "instructions",
  pages: [
    ""
  ],
  key_forward: "d"
}

const getData = function() {
  normalizeExemplars(exemplars).forEach(image =>
    jsPsych.data.get().push(image)
  );
  const ratingOutput = new Blob(
    [
      jsPsych.data
        .get()
        .ignore([
          "trial_type",
          "time_elapsed",
          "responses",
          "stimulus",
          "stimuli",
          "internal_node_id",
          "view_history"
        ])
        .csv()
    ],
    { type: "text/csv" }
  );
  const encodingOutput = new Blob(
    [
      jsPsych.data
        .get()
        .filterCustom(trial => trial.trialType === "encoding")
        .ignore(["internal_node_id", "trial_index", "stimulus", "trial_type"])
        .csv()
    ],
    { type: "text/csv" }
  );
  const testingOutput = new Blob(
    [
      jsPsych.data
        .get()
        .filterCustom(trial => trial.trialType === "testing")
        .ignore([
          "trial_type",
          "time_elapsed",
          "stimulus",
          "internal_node_id",
          "view_history",
          "trial_index"
        ])
        .csv()
    ],
    { type: "text/csv" }
  );
  const folderName = "experiment-data-" + param.participantId;
  const filenameEncoding = {
    name: `encoding_data_${param.participantId}.csv`,
    data: encodingOutput
  };
  const filenameTesting = {
    name: `testing_data_${param.participantId}.csv`,
    data: testingOutput
  };
  const filenameRating = {
    name: `rating_data_${param.participantId}.csv`,
    data: ratingOutput
  };
  const files = [filenameEncoding, filenameTesting, filenameRating];
  saveJsPsychFilesAsZip(files, folderName, jsPsych.getDisplayElement());
};

const downloadData = {
  type: "call-function",
  func: getData
};

timeline.push(completionCode);
timeline.push(download);
timeline.push(downloadData);

jsPsych.init({
  timeline: timeline
  
});
