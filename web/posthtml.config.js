const plugins = [
    require('posthtml-external-link-target-blank')(),
    require('posthtml-transform')([
        {
            selector: 'img',
            attr: 'loading',
            value: 'lazy',
        }, {
            selector: 'iframe',
            attr: 'loading',
            value: 'lazy',
        },
    ]),
]

if (process.env.NODE_ENV === 'production') {
    plugins.push(
        require('posthtml-attrs-sorter')(),
        require('htmlnano')({ collapseWhitespace: 'conservative' }, require('htmlnano').presets.max),
    )
}

module.exports = {
    plugins: plugins,
}
