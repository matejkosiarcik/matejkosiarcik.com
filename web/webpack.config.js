const path = require('path');
const process = require('process');
const glob = require('glob');

const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const CopyPlugin = require('copy-webpack-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');

const sassImporter = require('node-sass-glob-importer');

process.env.NODE_ENV = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const outputDir = 'public';

// search all jekyll generated html pages
const plugins = glob.sync('jekyll/_site/**/*.html', { nodir: true }).map((file) => new HtmlPlugin({
  filename: file.replace(/.*_site[\\/]/, ''),
  template: file,
  inject: process.env.NODE_ENV === 'development',
  minify: false,
})).concat([
  new CopyPlugin({
    patterns:
      [].concat(
        glob.sync('../images/favicon/{original,artifacts}/*.{svg,png,ico}').map((file) => ({ from: file, to: '' })),
        glob.sync('../images/icons/{original,artifacts}/*.{jpg,png,svg,gif,webp}').map((file) => ({ from: file, to: 'img' })),
        glob.sync('../images/pictures/artifacts/*.{jpg,png,svg,gif,webp}').map((file) => ({ from: file, to: 'img' })),
        glob.sync('./config/*', { nodir: true }).map((file) => ({ from: file, to: '' })),
        glob.sync('./config/well-known/*', { nodir: true }).map((file) => ({ from: file, to: '.well-known' })),
        [
          { from: path.join(__dirname, 'jekyll', '_site', 'sitemap.xml'), to: '' },
          { from: path.join(__dirname, 'script', 'goatcounter', 'goatcounter.js'), to: '' },
        ],
      ),
  }),
]);

if (process.env.NODE_ENV === 'production') {
  plugins.push(
    new FixStyleOnlyEntriesPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  );
}

const cssLoaders = (process.env.NODE_ENV === 'production' ? [
  {
    loader: MiniCssExtractPlugin.loader,
    options: {
      publicPath: '/',
    },
  },
] : [
  'style-loader',
]).concat([
  {
    loader: 'css-loader',
    options: {
      url: false,
      import: false,
      modules: false,
      esModule: false,
      sourceMap: false,
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      sourceMap: false,
    },
  },
  {
    loader: 'sass-loader',
    options: {
      implementation: require('sass'),
      sassOptions: {
        importer: sassImporter(),
        outputStyle: 'expanded',
      },
    },
  },
]);

const config = {
  mode: process.env.NODE_ENV,
  output: {
    filename: '[name].js',
    path: path.join(__dirname, outputDir),
    publicPath: '/',
    crossOriginLoading: 'anonymous',
  },
  entry: {
    bundle: path.join(__dirname, 'script', 'main.ts'),
    style: path.join(__dirname, 'style', 'main.scss'),
  },
  target: 'web',
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              sources: false,
              minimize: false,
            },
          },
          {
            loader: 'posthtml-loader',
          },
        ],
      },
      {
        test: /\.ts$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: cssLoaders,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.wasm', '.json'],
  },
  plugins: plugins,
  optimization: {
    minimize: process.env.NODE_ENV === 'production',
    minimizer: [
    ],
  },
  watch: process.env.NODE_ENV === 'development',
};

if (process.env.NODE_ENV === 'development') {
  config.devServer = {
    hot: true,
    publicPath: config.output.publicPath,
    progress: false,
  };
}

module.exports = config;
