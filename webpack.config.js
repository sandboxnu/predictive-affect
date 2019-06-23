const path = require('path');

module.exports = {
  entry: './src/experiment.js',
  output: {
    filename: 'experiment.js',
    path: path.resolve(__dirname, 'dist')
  }
}