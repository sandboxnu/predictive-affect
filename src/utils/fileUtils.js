
/* FILE SAVING */

// taken from jspsych codebase
// fixme: abstract into our own fork of jspsych
const JSON2CSV = (objArray) => {
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
  let line = '';
  let result = '';
  const columns = [];

  let i = 0;
  const keyLoop = (key) => {
    let keyString = `${key}`;
    keyString = `"${keyString.replace(/"/g, '""')}",`;
    if (!columns.includes(key)) {
      columns[i] = key;
      line += keyString;
      i += 1;
    }
  };
  for (let j = 0; j < array.length; j += 1) {
    Object.keys(array[j]).forEach(keyLoop);
  }

  line = line.slice(0, -1);
  result += `${line}\r\n`;

  for (i = 0; i < array.length; i += 1) {
    let curLine = '';
    for (let j = 0; j < columns.length; j += 1) {
      const value = (typeof array[i][columns[j]] === 'undefined') ? '' : array[i][columns[j]];
      const valueString = `${value}`;
      curLine += `"${valueString.replace(/"/g, '""')}",`;
    }

    curLine = curLine.slice(0, -1);
    result += `${curLine}\r\n`;
  }

  return result;
};

const saveJSONAsCSV = (json) => {
  const csv = JSON2CSV(json);
  const filename = 'lol.csv';
  var file = new Blob([csv], { type: 'csv' });
  if (window.navigator.msSaveOrOpenBlob) // IE10+
      window.navigator.msSaveOrOpenBlob(file, filename);
  else { // Others
      var a = document.createElement("a"),
              url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function() {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);  
      }, 0); 
  } 
};

module.exports = {
  default: saveJSONAsCSV
}