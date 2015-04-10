'use strict';

//   Libraries

var fs = require('fs'),
    gulp = require('gulp'),
    jade = require('gulp-jade'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),    
    addSrc = require('gulp-add-src'),
    sourcemaps = require('gulp-sourcemaps');

//
//   Paths and configurations
//
var paths = {
    js : [
        'front/src/scripts/main.js',
        'front/src/scripts/app.js'

    ],
    libs : [
        'front/vendor/jquery/dist/jquery.min.js',
        'front/vendor/jquery.cookie/jquery.cookie.js',
        'front/vendor/underscore/underscore.js',
        'front/vendor/backbone/backbone.js',
        'front/vendor/bootstrap/dist/js/bootstrap.min.js',
        'front/vendor/async/lib/async.js',
        'front/vendor/bootstrap-material-design/scripts/ripples.js',
        'front/vendor/bootstrap-material-design/scripts/material.js',
        'front/vendor/localforage/dist/localforage.min.js'
    ]
};

//
//   Layout
//
gulp.task('jade', function() {
    return gulp
        .src('front/src/views/**/*.jade')
        .pipe(jade({ pretty : true, locals : { v : (new Date()).getTime() }}))
        .pipe(gulp.dest('front/dist'))
});

//
//   CSS related tasks
//
gulp.task('less-app', function() {
    return gulp
        .src(['front/src/styles/*.less', '!src/styles/bootstrap.less'])
        .pipe(less())
        .pipe(gulp.dest('front/dist/css'))
});

gulp.task('less-material-prepare', function(cb) {
    if (!fs.existsSync('vendor/bootstrap-material-design/less/_variables.original.less')) {
        return gulp
            .src('front/vendor/bootstrap-material-design/less/_variables.less')
            .pipe(rename('_variables.original.less'))
            .pipe(gulp.dest('front/vendor/bootstrap-material-design/less'));
    } else {
        cb();
    }
});

gulp.task('less-material-concat', ['less-material-prepare'], function(){
    return gulp
        .src('front/vendor/bootstrap-material-design/less/_variables.original.less')
        .pipe(addSrc.append('src/styles/material.less'))
        .pipe(concat('_variables.less'))
        .pipe(gulp.dest('front/vendor/bootstrap-material-design/less'))
});

gulp.task('less-material-compile', ['less-material-concat'], function(){
    return gulp
        .src([
            'front/vendor/bootstrap-material-design/less/material.less',
            'front/vendor/bootstrap-material-design/less/ripples.less',
            'front/vendor/bootstrap-material-design/less/roboto.less'
        ])
        .pipe(concat('material.less'))
        .pipe(less())
        .pipe(gulp.dest('front/dist/css'))
});

gulp.task('less-material', ['less-material-prepare', 'less-material-compile']);

gulp.task('less', ['less-app', 'less-bootstrap', 'less-material']);

//
//   JS related tasks
//
gulp.task('js-app', function() {
    return gulp
        .src(paths.js)
        .pipe(sourcemaps.init())
        .pipe(concat('all.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('front/dist/js'))
});

gulp.task('js-libs', function() {
    return gulp
        .src(paths.libs)
        .pipe(sourcemaps.init())
        .pipe(concat('vendor.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('front/dist/js/'));
});

gulp.task('js', ['js-app', 'js-libs']);

//
//   Common tasks
//
gulp.task('copy-images', function () {
    return gulp
        .src('front/src/images/**/*.*')
        .pipe(gulp.dest('front/dist/images/'));
});

gulp.task('copy-fonts', function() {
    return gulp
        .src([
            'front/vendor/bootstrap/fonts/*.*',
            'front/vendor/bootstrap-material-design/fonts/*.*',
            'front/src/fonts/*.*'
        ])
        .pipe(gulp.dest('front/dist/fonts/'))
});

//
// Live compilation
//
gulp.task('watch', function() {
    gulp.watch(['views/**/*.jade'], { cwd : "src" }, ['jade']);
    gulp.watch(['styles/*.less', '!styles/bootstrap.less'], { cwd : "src" }, ['less']);
    gulp.watch(['styles/bootstrap.less'], { cwd : "src" }, ['less-bootstrap']);
    gulp.watch(['scripts/**/*.js'], { cwd : "src" }, ['js']);
    gulp.watch(['images/**/*.*'], { cwd : "src" }, ['copy-images']);
});

gulp.task('install', [
    'copy-images',
    'copy-fonts',
    'js',
    'less',
    'jade'
]);