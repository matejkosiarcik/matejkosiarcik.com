module.exports = {
    plugins: [
        // import first
        require('postcss-easy-import')(),

        // loops
        require('postcss-for')(),
        require('postcss-each')(),

        // nesting
        require('postcss-nested-ancestors')(),
        require('postcss-nested')(),

        // other transformations
        require('postcss-extend-rule')(),
        require('postcss-atroot')(),

        // variables here
        // decided against postcss-css-variables
        require('postcss-custom-properties')({
            preserve: false,
        }),

        require('postcss-property-lookup')(),

        // main plugin
        require('postcss-preset-env')({
            autoprefixer: false,
            stage: 0,
            preserve: false,
        }),

        // fallback fixes
        require('postcss-gradient-transparency-fix')(),
        require('postcss-calc')(),
        require('postcss-opacity')(),
        require('postcss-filter-gradient')(),

        // autoprefixer last
        require('autoprefixer')(),
    ]
}
