const gulp = require('gulp');
const sriHash = require('gulp-sri-hash');

gulp.task('sri', () => {
  return gulp.src('public/**/*.html')
    .pipe(sriHash())
    .pipe(gulp.dest('public'));
});
