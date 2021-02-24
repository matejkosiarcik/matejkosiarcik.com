const plugins = [
    require('posthtml-outlinks')({}),
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
        // {
        //     selector: 'img[width][height]',
        //     attr: 'data-visibilty',
        //     value: '',
        // },
    ]),
];

if (process.env.NODE_ENV === 'production') {
    plugins.push(
        require('posthtml-attrs-sorter')(),
    );
}

module.exports = {
    plugins: plugins,
};
