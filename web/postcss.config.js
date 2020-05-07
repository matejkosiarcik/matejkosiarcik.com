const plugins = [
    require('postcss-easy-import')({
        extensions: ['.css', '.scss'],
        prefix: '_',
    }),
    require('postcss-css-variables')({
        preserve: false,
    }),
    require('postcss-preset-env')({
        preserve: false,
        autoprefixer: false,
        features: {
            'custom-properties': false, // instead using css-variables
            'css-prefers-color-scheme': false, // do not translate dark mode
            'css-blank-pseudo': true, // TODO: add js
            'custom-media': true,
        },
    }),
    require('postcss-inline-svg')({
        paths: ['/'],
    }),
    require('autoprefixer')(),
]

if (process.env.NODE_ENV === 'production') {
    plugins.push(
        require('postcss-clean')(),
        require('cssnano')(),
        require('postcss-csso')({ restructure: true }),
    )
}

module.exports = {
    parser: 'postcss-scss',
    plugins: plugins,
}
