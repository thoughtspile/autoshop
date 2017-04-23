const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {
    bundle: './public/js/src/index.js',
  },
  output: {
    path: './public/js',
    filename: '[name].js',
  },
  devtool: 'eval',
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', query: { presets: ['es2015'] } },
    ],
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      comments: false,
      compress: {
        warnings: false,
      },
    }),
    new webpack.ProvidePlugin({ fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch' }),
  ],
};
