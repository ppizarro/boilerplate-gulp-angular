'use strict';

var gulp = require('gulp');
var plug = require('gulp-load-plugins')();
var pkg = require('../package.json');

gulp.task('help', plug.taskListing);

gulp.task('analyze', function () {
  return gulp.src(pkg.paths.js)
    .pipe(plug.jshint('./.jshintrc'))
    .pipe(plug.jshint.reporter('jshint-stylish'))
    .pipe(plug.jscs('./.jscsrc'));
});

gulp.task('clean', function () {
  return gulp.src([pkg.paths.tmp, pkg.paths.build], { read: false }).pipe(plug.rimraf());
});

gulp.task('build', ['analyze']);

