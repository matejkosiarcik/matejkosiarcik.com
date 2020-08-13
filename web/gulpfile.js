const gulp = require('gulp')
const sriHash = require('gulp-sri-hash')
const svgo = require('gulp-svgo')

gulp.task('sri', () => {
    return gulp.src('public/**/*.html')
        .pipe(sriHash())
        .pipe(gulp.dest('public'))
})

gulp.task('svgo', () => {
    return gulp.src('public/**/*.svg')
        .pipe(svgo())
        .pipe(gulp.dest('public'))
})
