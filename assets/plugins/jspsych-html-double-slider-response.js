jsPsych.plugins["html-double-slider-response"] = (function() {

  var plugin = {};

  plugin.info = {
    name: "html-double-slider-response",
    parameters: {
      slider_count: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Slider Count',
        default: 2,
        description: 'Sets how many sliders will be displayed',
      },
      stimuli: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Stimuli',
        default: '',
        array: true,
        description: 'The HTML string to be displayed'
      },
      default_stimuli: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Default Stimuli',
        default: 'No default defined',
        array: false,
        description: 'The HTML string to be displayed'
      },
      min: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Min slider',
        default: [0, 0],
        array: true,
        description: 'Sets the minimum value of the slider.'
      },
      default_min: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Default Min slider',
        default: 0,
        description: 'Sets the minimum value of the slider.'
      },
      max: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Max slider',
        default: [75, 150],
        array: true,
        description: 'Sets the maximum value of the slider',
      },
      default_max: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Default Max slider',
        default: 100,
        array: false,
        description: 'Sets the minimum value of the slider.'
      },
      start: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Slider starting value',
        default: [25, 100],
        array: true,
        description: 'Sets the starting value of the slider',
      },
      default_start: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Default Min slider',
        default: 0,
        array: false,
        description: 'Sets the minimum value of the slider.'
      },
      step: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Step',
        default: [5, 1],
        array: true,
        description: 'Sets the step of the slider'
      },
      default_step: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Default Step',
        default: 1,
        array: false,
        description: 'Sets the step of the slider'
      },
      labels: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name:'Labels',
        default: [],
        array: true,
        description: 'Labels of the slider.',
      },
      default_labels: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Default Step',
        default: [],
        array: true,
        description: 'Sets the step of the slider'
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Continue',
        array: false,
        description: 'Label of the button to advance.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: [],
        array: true,
        description: 'Any content here will be displayed below the slider.'
      },
      default_prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: '',
        array: false,
        description: 'Any content here will be displayed below the slider.'
      },
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide the stimulus.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show the trial.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when user makes a response.'
      },
    }
  }

  plugin.trial = function(display_element, trial) {

    var html = '';

    // Display trial.slider_count amount of sliders
    for(var i = 0; i < trial.slider_count; i++) {
      html += '<div id="jspsych-html-slider-response-wrapper"  style="margin: 60px 0px; width: 30em;">';

      // Stimulus
      html += '<div id="jspsych-html-slider-response-stimulus">';
      html += (trial.stimuli.length >= i + 1)? trial.stimuli[i] : trial.default_stimuli;
      html +=  '</div>';
      // // Slider Prompt
      html += '<div style="padding: 0px 30px;">';
      html += (trial.prompt.length >= i + 1)? trial.prompt[i] : trial.default_prompt;
      html +=  '</div>';
      
      // Slider & pics
      html += '<div class="jspsych-html-slider-response-container" style="position:relative;">';
      // Slider 
      html += '<div class="jspsych-html-slider-response-slider-container">'; 
      html += '<input type="range" value="';
      html += (trial.start.length >= i + 1)? trial.start[i] : '1'
      html += '" min="';
      html += (trial.min.length >= i)? trial.min[i] : trial.default_min;
      html += '" max="';
      html += (trial.max.length >= i + 1)? trial.max[i] : trial.default_max
      html += '" step="';
      html += trial.step[i]
      html += '" style="width: 100%; background: black;" id="jspsych-html-slider-response-response-' + i + '"></input>';
      html += '</div>';

      // Slider Labels
      // html += '<div>';
      html += '<div class="jspsych-html-slider-response-labels-container">'; // <labels
      var labels_count = (trial.labels.length >= i + 1) ? trial.labels[i].length : trial.default_labels.length;
      for(var j=0; j < labels_count; j++){
        var width = 100/(labels_count-1);
        var left_offset = (j * (100 /(labels_count - 1))) - (width/2);
        html += '<div style="display: inline-block; position: absolute; left:'+left_offset+'%; text-align: center; width: '+width+'%;">';
        html += '<span style="text-align: center; font-size: 80%;">';
        html +=  (trial.labels.length >= i + 1)? trial.labels[i][j] : trial.default_labels[j];
        html += '</span>';
        html += '</div>';
      }
      html += '</div>'; // </labels
      html += '</div>'; // </Slider+Pics
      html += '</div>'; // </Entire
    }

    // add submit button
    html += '<button id="jspsych-html-slider-response-next" class="jspsych-btn">'+trial.button_label+'</button>';

    display_element.innerHTML = html;

    var response = {
      rt: null,
      responses: null
    };

    display_element.querySelector('#jspsych-html-slider-response-next').addEventListener('click', function() {
      // measure response time
      var endTime = performance.now();
      response.rt = endTime - startTime;
      response.responses = [];
      for(var i = 0; i < trial.slider_count ; i++) {
        response.responses.push(display_element.querySelector('#jspsych-html-slider-response-response-' + i).value)
      }

      if(trial.response_ends_trial){
        end_trial();
      } else {
        display_element.querySelector('#jspsych-html-slider-response-next').disabled = true;
      }

    });

    function end_trial(){

      jsPsych.pluginAPI.clearAllTimeouts();

      // save data
      var trialdata = {
        "rt": response.rt,
        "responses": response.responses,
        "stimuli": trial.stimuli,
      };

      display_element.innerHTML = '';

      // next trial
      jsPsych.finishTrial(trialdata);
    }

    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-html-slider-response-stimulus').style.visibility = 'hidden';
      }, trial.stimulus_duration);
    }

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

    var startTime = performance.now();
  };

  return plugin;
})();
