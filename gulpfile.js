var gulp = require('gulp');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');

gulp.task('sass', function () {
  return gulp.src('_html/sass/styles.sass')
    .pipe(sass().on('error', sass.logError))
    .on('error', onError)
    .pipe(prefix())
    .pipe(gulp.dest('app/css/'));
});

gulp.task('watch', function () {
  gulp.watch('**/*.sass', ['sass']);
});

gulp.task('default', function(){
  gulp.run(['sass', 'watch']);
});

function onError (error) {
    console.log(error.toString());
    this.emit('end');
}