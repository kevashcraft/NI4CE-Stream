var autoprefixer = require('gulp-autoprefixer');
var debug = require('gulp-debug');
var del = require('del');
var es = require('event-stream');
var exec = require('child_process').exec;
var favicons = require('gulp-favicons');
var fs = require('fs');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var minifyJS = require('gulp-minify');
var minifyCSS = require('gulp-clean-css');
var minifyHTML = require('gulp-htmlmin');
var sass = require('gulp-sass');
var symlink = require('gulp-sym');
var twig = require('gulp-twig');
var vulcanize = require('gulp-vulcanize');

var abspath = '';
var data = {};

// remove dist directory
gulp.task('clean', function(cb) {
  return del('dist');
});

gulp.task('data', function(cb) {
  exec('php app/index.php', function (err, stdout, stderr) {
    data = JSON.parse(fs.readFileSync('./data.json'));
    cb(err);
  });
});

gulp.task('favicons', ['data'], function() {
  gulp.src("graphics/ni4ce-stream.png").pipe(favicons({
    appName: data.site.title,
    appDescription: data.site.description,
    developerName: data.site.author,
    developerURL: data.site.authorUrl,
    background: "#26A69A",
    path: "/favicons/",
    url: data.site.url,
    display: "standalone",
    orientation: "portrait",
    version: 1.0,
    logging: false,
    online: false,
    html: "index.html",
    pipeHTML: true,
    replace: true,
  })).pipe(gulp.dest("static/favicons"));
});

// twig rendering
gulp.task('site', ['data'], function() {
  'use strict';
  data.abspath = abspath;
  return gulp.src('site/pages/**/*.twig')
    .pipe(twig({
      errorLogToConsole: true,
      base: 'site',
      data: data,
    }))
    .pipe(gulp.dest('dist'));
});

// styles
gulp.task('styles', function(cb) {
  return gulp.src('styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false,
    }))
    .pipe(gulp.dest('dist/styles/'));
});

// scripts
gulp.task('scripts', function(cb) {
  return gulp.src('scripts/**/*.js')
    .pipe(gulp.dest('dist/scripts/'));
});

// static
gulp.task('static', function() {
  return gulp.src(['static/**/*', 'static/**/.*'])
    .pipe(gulp.dest('dist'));
});

// minimize
gulp.task('minimize', ['default'], function(cb) {
  return es.merge([
    gulp.src('dist/styles/**')
      .pipe(minifyCSS())
      .pipe(gulp.dest('dist/styles')),
    gulp.src('dist/scripts/**')
      .pipe(minifyJS({
        ext: {
          min: '.js',
        },
        noSource: true,
      }))
      .pipe(gulp.dest('dist/scripts')),
    gulp.src('dist/**/*.html')
      .pipe(minifyHTML({
        collapseWhitespace: true,
      }))
      .pipe(gulp.dest('dist')),
  ]);
});

// vulcanize
gulp.task('vulcanize', ['minimize'], function() {
  return gulp.src(['dist/**/*.html', '!dist/components'])
    .pipe(vulcanize({
      abspath: '',
      inlineCss: true,
      inlineScripts: true,
    }))
    .pipe(gulp.dest('dist'));
});

// clean dist
gulp.task('clean_dist', ['vulcanize'], function () {
  del('dist/styles');
  del('dist/scripts');
});

gulp.task('dist', function() {
  abspath = __dirname + '/dist';
  gulp.start('clean_dist');
});

// dist
// gulp.task('dist', ['clean_dist']);

// // symlinks
// gulp.task('symlinks', ['minify'], function (cb) {
//   return gulp.src(['bower_components', 'wl/static', 'creatives'])
//     .pipe(symlink(['dist/components', 'dist/static/wl', 'dist/creatives']));
// })

gulp.task('default', ['static', 'styles', 'scripts', 'site',]);

gulp.task('watch', ['default'], function() {
  gulp.watch('styles/**/*.scss', ['styles']);
  gulp.watch('scripts/**/*.js', ['scripts']);
  gulp.watch(['views/**/*.twig', 'site', 'public'], ['site']);
});

