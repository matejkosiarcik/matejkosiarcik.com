const preset = require('cssnano-preset-default')

module.exports = preset({
    discardComments: {
        removeAll: true,
    },
})
