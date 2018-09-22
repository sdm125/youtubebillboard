const gulp = require('gulp');
const sass = require('gulp-sass');
const nodemon = require('gulp-nodemon');
const livereload = require('gulp-livereload');
const mainBowerFiles = require('main-bower-files');

// Build Packages
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');

/*
   -- TOP LEVEL FUNCTIONS --
   gulp.task - Define tasks
   gulp.src - Point to files to use
   gulp.dest - Point to folder to output
   gulp.watch - Watch files and folders for changes
*/

// Log Message
gulp.task('message', function(){
  console.log('Gulp running...');
});

gulp.task('copyHtml', function(){
  gulp.src('src/index.html')
    .pipe(gulp.dest('dist'))
});

// Copy all HTML files
gulp.task('copyTemplates', function(){
  gulp.src('src/templates/*.html')
    .pipe(gulp.dest('dist/templates'))
});

// Optimize Images
gulp.task('imageMin', () =>
	gulp.src('src/images/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/images'))
);

// Compile SASS
gulp.task('sass', function(){
  gulp.src('src/sass/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('dist/css'))
});

// Scripts
gulp.task('scripts', function(){
  gulp.src('src/js/*.js')
      .pipe(concat('main.controller.js'))
      // TODO: set mangle to false. variable names getting messed up.
      // .pipe(uglify())
      .pipe(gulp.dest('dist/js'));
});

// bower
gulp.task('main-bower-files', function() {
    return gulp.src(mainBowerFiles(), { base: 'bower_components' })
        .pipe(gulp.dest('dist/vendor'));
});

gulp.task('server',function(){
    nodemon({
        'script': 'app.js',
        'ignore': 'dist/js/*.js'
    });
});

gulp.task('watch', function(){
  gulp.watch('bower_components/*', ['main-bower-files']);
  gulp.watch('src/js/*.js', ['scripts']);
  gulp.watch('src/images/*', ['imageMin']);
  gulp.watch('src/sass/*.scss', ['sass']);
  gulp.watch('src/index.html', ['copyHtml']);
  gulp.watch('src/templates/*.html', ['copyTemplates']);
});

gulp.task('serve', ['server','watch']);
