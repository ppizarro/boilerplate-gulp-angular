'use strict';

var gulp = require('gulp');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

gulp.task('watch', ['wiredep'] ,function () {
  gulp.watch('app/**/*.js', ['analyze']);
  gulp.watch('bower.json', ['wiredep']);
});

