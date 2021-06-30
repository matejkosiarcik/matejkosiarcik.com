const plugins = [
  require('posthtml-outlinks')({}),
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(
    require('posthtml-transform')([
      {
        selector: 'img',
        attr: 'loading',
        value: 'lazy',
      },
      {
        selector: 'iframe',
        attr: 'loading',
        value: 'lazy',
      },
      {
        selector: 'img',
        attr: 'decoding',
        value: 'async',
      },
      {
        selector: 'th',
        attr: 'scope',
        value: 'col',
      },
    ]),
    require('posthtml-attrs-sorter')(),
  );
}

module.exports = {
  plugins: plugins,
};
