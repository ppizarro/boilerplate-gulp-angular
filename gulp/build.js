'use strict';

var gulp = require('gulp');
var plug = require('gulp-load-plugins')();
var pkg = require('../package.json');
var saveLicense = require('uglify-save-license');

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

gulp.task('clean', function () {
  return gulp.src([pkg.paths.tmp, pkg.paths.build], { read: false })
    .pipe(plug.rimraf());
});

gulp.task('build', ['html']);

