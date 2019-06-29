const JSZip = require('jszip')

/**
 * Saves given files to the local device in a compressed folder.
 * @param {*} files list of filename objects {name: String, data: JSON}
 * @param {*} folderName name of the folder to be downloaded
 * @param {*} displayElement the current jsPsych displayElement
 */
const saveJsPsychFilesAsZip = (files, folderName, displayElement) => {
    const zip = new JSZip();
    const folder = zip.folder(folderName);
    for (let file of files) {
      folder.file(file.name, file.data);
    }
    zip.generateAsync({ type: 'blob' })
      .then(zipBlob => {
        const blobURL = window.URL.createObjectURL(zipBlob)
        const filename = "experiment-output.zip"
        displayElement.insertAdjacentHTML('beforeend','<a id="jspsych-download-as-text-link" style="display:none;" download="'+filename+'" href="'+blobURL+'">click to download</a>');
        document.getElementById('jspsych-download-as-text-link').click();
      });
    }

module.exports = {
  saveJsPsychFilesAsZip
}