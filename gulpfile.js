var gulp = require('gulp');
var addsrc = require('gulp-add-src');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var minifycss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var eslint = require('gulp-eslint');
var concat = require('gulp-concat');
var notify = require('gulp-notify');

var sourcesPath = './src';
var assetsPath = './dist';

var jslibs = [
  sourcesPath + '/js/vendors/jquery-3.1.0.min.js',
    sourcesPath + '/js/vendors/jquery.youtubebackground.js',
    sourcesPath + '/js/vendors/smooth.scroll.js',
    sourcesPath + '/js/vendors/inview.min.js'
];

var jsApp = [
  sourcesPath + '/js/app.js'
];


gulp.task('lint', function() {
  return gulp.src(jsApp)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('sass', function() {
  return gulp.src(sourcesPath + '/sass/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 5 version', 'safari 5', 'ie 10', 'opera 12.1'))
    .pipe(gulp.dest(assetsPath))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest(assetsPath));
});

gulp.task('js', function() {
  return gulp.src(jsApp)
    .pipe(plumber())
    // .pipe(eslint())
    // .pipe(eslint.format())
    // .pipe(eslint.failOnError())
    .pipe(sourcemaps.init())
    .pipe(addsrc.prepend(jslibs))
    .pipe(concat(assetsPath + '/main.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./'))
    .pipe(notify('Complete!'));
});


gulp.task('watch', function() {
  gulp.watch(sourcesPath + '/sass/**/*.scss', ['sass']);
  gulp.watch(jsApp, ['js']);
});

gulp.task('default', ['sass', 'js', 'watch']);

