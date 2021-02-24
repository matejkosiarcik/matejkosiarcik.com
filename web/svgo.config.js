const { extendDefaultPlugins } = require('svgo');

module.exports = {
    multipass: true,
    plugins: extendDefaultPlugins([
        {
            name: 'cleanupListOfValues',
        },
        {
            name: 'removeOffCanvasPaths',
        },
        {
            name: 'removeRasterImages',
        },
        {
            name: 'removeScriptElement',
        },
        {
            name: 'reusePaths',
        },
        {
            name: 'sortAttrs',
        },
    ]),
}
