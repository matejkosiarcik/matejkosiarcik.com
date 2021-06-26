const path = require('path');

process.env.NODE_ENV = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const outputDir = 'public';

const config = {
  mode: process.env.NODE_ENV,
  output: {
    filename: '[name].js',
    path: path.join(__dirname, outputDir),
    publicPath: '/',
    crossOriginLoading: 'anonymous',
  },
  entry: {
    'bundle-legacy': path.join(__dirname, 'script', 'main.ts'),
  },
  target: 'es5',
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'babel-loader',
        // exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.wasm', '.json'],
  },
  optimization: {
    minimize: process.env.NODE_ENV === 'production',
    minimizer: [
    ],
  },
};

module.exports = config;
