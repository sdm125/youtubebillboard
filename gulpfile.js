const gulp = require('gulp');
const sass = require('gulp-sass');
const nodemon = require('gulp-nodemon');
const concat = require('gulp-concat');

// Compile SASS
gulp.task('sass', () => {
  return new Promise((resolve, reject) => {
    gulp.src('src/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css'))
    resolve();
  })
});

// Scripts
gulp.task('scripts', () => {
  return new Promise((resolve, reject) => {
    gulp.src('src/js/*.js')
    .pipe(concat('main.controller.js'))
    .pipe(gulp.dest('dist/js'))
    resolve();
  })
});

const server = () => { 
  nodemon({
      'script': 'app.js',
      'ignore': 'dist/js/*.js'
  });
};

const watch = () => {
  gulp.watch('src/js/*.js', gulp.series(['scripts']));
  gulp.watch('src/sass/*.scss', gulp.series(['sass']));
};

gulp.task('serve', gulp.parallel(watch, server));
