'use strict';

//   Libraries

var fs = require('fs'),
    gulp = require('gulp'),
    jade = require('gulp-jade'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),    
    addSrc = require('gulp-add-src'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel');

//
//   Paths and configurations
//
var paths = {
    js : [
        'front/src/scripts/app.js',
        'front/src/scripts/services/*.js',
        'front/src/scripts/providers/*.js',
        'front/src/scripts/directives/*.js',
        'front/src/scripts/controllers/*.js'
    ],
    libs : [
        'front/vendor/jquery/dist/jquery.js',
        'front/vendor/angular/angular.js',
        'front/vendor/angular-route/angular-route.js',
        'front/vendor/angular-cookies/angular-cookies.js',
        'front/vendor/angular-bootstrap/ui-bootstrap-tpls.js',
        'front/vendor/angular-relative-date/angular-relative-date.js'
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
        .src(['front/src/styles/*.less'])
        .pipe(less())
        .pipe(gulp.dest('front/dist/css'))
});

gulp.task('less-bootstrap-prepare', function(cb) {
    if (!fs.existsSync('front/vendor/bootstrap/less/variables.original.less')) {
        return gulp
            .src('front/vendor/bootstrap/less/variables.less')
            .pipe(rename('variables.original.less'))
            .pipe(gulp.dest('front/vendor/bootstrap/less'));
    } else {
        cb();
    }
});

gulp.task('less-bootstrap-concat', ['less-bootstrap-prepare'], function(){
    return gulp
        .src('front/vendor/bootstrap/less/variables.original.less')
        .pipe(addSrc.append('front/src/styles/bootstrap.less'))
        .pipe(concat('variables.less'))
        .pipe(gulp.dest('front/vendor/bootstrap/less'))
});

gulp.task('less-bootstrap-compile', ['less-bootstrap-concat'], function(){
    return gulp
        .src('front/vendor/bootstrap/less/bootstrap.less')
        .pipe(less())
        .pipe(gulp.dest('front/dist/css'))
});


gulp.task('less-bootstrap', ['less-bootstrap-prepare', 'less-bootstrap-concat', 'less-bootstrap-compile']);

gulp.task('less', ['less-app', 'less-bootstrap']);

//
//   JS related tasks
//
gulp.task('js-app', function() {
    return gulp
        .src(paths.js)
        .pipe(sourcemaps.init())
        .pipe(babel())
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
gulp.task('copy-img', function () {
    return gulp
        .src('front/src/img/**/*.*')
        .pipe(gulp.dest('front/dist/img/'));
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
    gulp.watch(['views/**/*.jade'], { cwd : "front/src" }, ['jade']);
    gulp.watch(['styles/*.less'], { cwd : "front/src" }, ['less']);
    gulp.watch(['scripts/**/*.js'], { cwd : "front/src" }, ['js-app']);
    gulp.watch(['img/**/*.*'], { cwd : "front/src" }, ['copy-img']);
});

gulp.task('install', [
    'copy-img',
    'copy-fonts',
    'js',
    'less',
    'jade'
]);







require('dotenv').load();

var argv = require('yargs').argv,
    path = require('path'),
    mysql = require('mysql');

var env = argv.env || process.env.NODE_ENV || 'development';

process.env.NODE_ENV = env;


//
//      Database related tasks
//
gulp.task('database-create', function(cb) {
    var config = require('./app/app.js').get('config').mysql;

    var connection = mysql.createConnection({
        host : config.host,
        user : config.username,
        password : config.password,
        multipleStatements: true
    });

    var query = (argv.force  ? `DROP DATABASE IF EXISTS ${config.database};\n` : ``)
        + `CREATE DATABASE ${config.database};`;

    connection.query(query, function(err) {
        connection.destroy();
        cb(err);
    });
});

gulp.task('database-sync', ['database-create'], function(cb) {
    require('./app/app.js').get('models').sequelize
        .sync({ force : argv.force })
        .then(function(){ cb(); });
});

gulp.task('database', ['database-create', 'database-sync']);