const gulp = require('gulp');
const sass = require('gulp-sass');
const nodemon = require('gulp-nodemon');
const concat = require('gulp-concat');

// Copy all HTML files
gulp.task('copyHtml', () => {
  return new Promise((resolve, reject) => {
    gulp.src('src/*.html')
    .pipe(gulp.dest('dist'))
    resolve();
  });
});

// Copy Template files
gulp.task('copyTemplates', function(){
  return new Promise((resolve, reject) => {
    gulp.src('src/templates/*.html')
      .pipe(gulp.dest('dist/templates'))
    resolve();
  });
});

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
  gulp.watch('src/templates/*.html', gulp.series(['copyTemplates']));
  gulp.watch('src/*.html', gulp.series(['copyHtml']));
  gulp.watch('src/js/*.js', gulp.series(['scripts']));
  gulp.watch('src/sass/*.scss', gulp.series(['sass']));
};

gulp.task('serve', gulp.parallel(watch, server));
