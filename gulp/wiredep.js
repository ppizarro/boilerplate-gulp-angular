'use strict';

var gulp = require('gulp');

var plug = require('gulp-load-plugins')();

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src('src/*.html')
    .pipe(wiredep({
      directory: 'src/bower_components'
    }))
    .pipe(gulp.dest('src'));
});
