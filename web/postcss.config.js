const plugins = [
    require('postcss-hexrgba'),
    require('postcss-custom-properties')({
        preserve: true,
    }),
    require('postcss-calc'),
    // require('postcss-preset-env')({
    //     preserve: false,
    //     autoprefixer: false,
    //     features: {
    //         'custom-properties': false, // instead using css-variables
    //         'css-prefers-color-scheme': false, // do not translate dark mode
    //     },
    // }),
    require('postcss-custom-media')({
        preserve: false,
    }),
    require('postcss-media-minmax'),
    require('autoprefixer'),
]

module.exports = {
    plugins: plugins,
}
