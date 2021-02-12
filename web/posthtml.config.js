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
        // TODO: benchmark if this is important or not
        // {
        //     selector: 'img',
        //     attr: 'decoding',
        //     value: 'async',
        // },
    ]),
]

if (process.env.NODE_ENV === 'production') {
    plugins.push(
        require('posthtml-attrs-sorter')(),
    )
}

module.exports = {
    plugins: plugins,
}
