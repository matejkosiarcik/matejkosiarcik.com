const glob = require('glob')

module.exports = (grunt) => {
    grunt.initConfig({
        'rcs': {
            options: {},
            css: {
                options: {
                    replaceCss: true,
                },
                files: [{
                    expand: true,
                    src: 'public/style.css',
                    dest: '.', // in-place
                }],
            },
            all: {
                files: [{
                    expand: true,
                    src: ['public/bundle.js'].concat(glob.sync('public/**/*.html')),
                    dest: '.', // in-place
                }],
            },
        },
    })

    grunt.loadNpmTasks('grunt-rcs')
    grunt.registerTask('default', ['rcs'])
}
