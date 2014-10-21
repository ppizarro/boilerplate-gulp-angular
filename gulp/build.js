'use strict';

var gulp = require('gulp');
var plug = require('gulp-load-plugins')();
var pkg = require('../package.json');
var saveLicense = require('uglify-save-license');
var del = require('del');
var mainBowerFiles = require('main-bower-files');

gulp.task('help', plug.taskListing);

gulp.task('analyze', function () {
  return gulp.src(pkg.paths.js)
    .pipe(plug.jshint('./.jshintrc'))
    .pipe(plug.jshint.reporter('jshint-stylish'))
    .pipe(plug.jscs('./.jscsrc'));
});

gulp.task('templatecache', function () {
  return gulp.src(pkg.paths.htmltemplates)
    .pipe(plug.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(plug.angularTemplatecache('templates.js', {
      module: 'app.core',
      standalone: false,
      root: 'app/'
    }))
    .pipe(gulp.dest(pkg.paths.tmp));
});

gulp.task('html', ['analyze', 'templatecache'], function () {
  var assets = plug.useref.assets();
  var jsFilter = plug.filter('**/*.js');
  var cssFilter = plug.filter('**/*.css');

  return gulp.src('src/*.html')
    .pipe(assets)
    .pipe(plug.rev())
    .pipe(jsFilter)
    .pipe(plug.ngAnnotate()) // {add: true, single_quotes: true}
    .pipe(plug.uglify({preserveComments: saveLicense})) // {mangle: true}
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe(plug.csso())
    .pipe(cssFilter.restore())
    .pipe(assets.restore())
    .pipe(plug.useref())
    .pipe(plug.revReplace())
    .pipe(gulp.dest(pkg.paths.build));
});

gulp.task('images', function() {
  return gulp.src('src/content/images/**/*')
    .pipe(plug.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(pkg.paths.build + 'content/images'));
});

gulp.task('fonts-vendor', function () {

  return  gulp.src(mainBowerFiles())
    .pipe(plug.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe(gulp.dest(pkg.paths.build + 'content/fonts'));
});

gulp.task('fonts', ['fonts-vendor'], function () {
  return gulp.src('src/content/fonts')
    .pipe(gulp.dest(pkg.paths.build + 'content/fonts'));
});

gulp.task('clean', function (cb) {
  del([pkg.paths.tmp, pkg.paths.build], cb);
});

gulp.task('build', ['html', 'images', 'fonts']);
