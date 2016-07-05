/* eslint-env node */

var assign = require('lodash.assign');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var concat = require('gulp-concat-sourcemap');
var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var watchify = require('watchify');

// libs
gulp.task('libs', function () {
  gulp.src(['node_modules/jquery/dist/jquery.min.js'])
     .pipe(concat('libs.js'))
     .pipe(gulp.dest('./build/'));
});

gulp.task('sass', function () {
  return gulp.src('./content_scripts/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./content_scripts/**/*.scss', ['sass']);
});

// See http://stackoverflow.com/questions/23835898/how-to-output-multiple-bundles-with-browserify-and-gulp

// add custom browserify options here
var customOpts = {
  entries: ['./content_scripts/js/facebook.js'],
  debug: true
};
var opts = assign({}, watchify.args, customOpts);
var w = watchify(browserify(opts)); 

// add transformations here
// i.e. b.transform(coffeeify);

gulp.task('js', ['libs'], bundle('facebook', browserify(opts))); // so you can run `gulp js` to build the file
gulp.task('js:watch', ['libs'], bundle('facebook', w));

gulp.task('watch', ['sass:watch', 'js:watch']); // so you can run 'gulp watch' to dev
w.on('update', bundle('facebook', w)); // on any dep update, runs the bundler
w.on('log', gutil.log); // output build logs to terminal

function bundle(name, bundler) {
  return function () {
    return bundler.bundle()
      // log errors if they happen
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source(name + '.bundle.js'))
      // optional, remove if you don't need to buffer file contents
      .pipe(buffer())
      // optional, remove if you dont want sourcemaps
      .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
        // Add transformation tasks to the pipeline here.
      .pipe(sourcemaps.write('./')) // writes .map file
      .pipe(gulp.dest('./build'));
  };
}
