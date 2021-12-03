const path = require('path');

module.exports = {
  mode: 'development',
  entry: [
    './assets/js/custom.js',
  ],
  output: {
    path: path.resolve(__dirname, 'js'),
    filename: 'nft.bundle.js',
  },
};