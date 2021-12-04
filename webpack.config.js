const path = require('path');

module.exports = {
  mode: 'development',
  entry: [
    './js/scroll.js',
  ],
  output: {
    path: path.resolve(__dirname, 'js'),
    filename: 'nft.bundle.js',
  },
};