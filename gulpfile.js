'use strict';

require('dotenv').load();


//   Libraries
var argv = require('yargs').argv,
    gulp = require('gulp'),
    fs = require('fs'),

    jade = require('gulp-jade'),
    less = require('gulp-less'),
    wrap = require('gulp-wrap'),
    gulpif = require('gulp-if'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),    
    addSrc = require('gulp-add-src'),
    sequence = require('gulp-sequence'),
    minifyCSS = require('gulp-minify-css'),

    prompt = require('prompt'),
    md5 = require('md5'),
    sourcemaps = require('gulp-sourcemaps'),
    path = require('path'),
    deepExtend = require('extend').bind(null, true);

var env = argv.env || process.env.NODE_ENV || 'development';
process.env.NODE_ENV = env;

//
//   Paths and configurations
//
var paths = {
    js : [
        'front/src/app.js',

        // base
        'front/src/base/base-module.js',
        'front/src/base/**/*.js',

        // auth
        'front/src/auth/auth-module.js',
        'front/src/auth/**/*.js',

        // common
        'front/src/common/common-module.js',
        'front/src/common/*.js',

        // menu
        'front/src/menu/menu-module.js',
        'front/src/menu/**/*.js',

        // disputes
        'front/src/disputes/disputes-module.js',
        'front/src/disputes/**/*.js'

    ],
    libs : [
        'front/vendor/jquery/dist/jquery.js',
        'front/vendor/angular/angular.js',
        'front/vendor/angular-ui-router/release/angular-ui-router.js',
        'front/vendor/angular-cookies/angular-cookies.js',
        'front/vendor/angular-bootstrap/ui-bootstrap-tpls.js',
        'front/vendor/angular-relative-date/angular-relative-date.js',
        'front/vendor/angular-ui-switch/angular-ui-switch.js',
        'front/vendor/angular-moment/angular-moment.js',
        'front/vendor/angular-permission/dist/angular-permission.js',
        'front/vendor/angular-animate/angular-animate.js'
    ]
};

//
//   Layout
//
gulp.task('jade', function() {
    return gulp
        .src('front/src/**/*.jade')
        .pipe(jade({ pretty : true, locals : { v : (new Date()).getTime() }}))
        .pipe(gulp.dest('front/dist'))
});

//
//   CSS related tasks
//
gulp.task('less-app', function() {
    return gulp
        .src(['front/assets/styles/styles.less'])
        .pipe(less())
        .pipe(gulp.dest('front/dist/css'))
});

gulp.task('less-bootstrap', function() {
    return gulp
        .src('front/vendor/bootstrap/less/bootstrap.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('front/dist/css'))
});

gulp.task('less', ['less-app', 'less-bootstrap']);

//
//   JS related tasks
//
gulp.task('js-app', function() {
    return gulp
        .src(paths.js)
        .pipe(wrap('(function(){\n<%= contents %>\n})();'))
        .pipe(babel({ modules : 'common' }))
        .pipe(concat('all.js'))
        .pipe(gulpif(argv.minify, uglify()))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('front/dist/js/'))
});

gulp.task('js-libs', function() {
    return gulp
        .src(paths.libs)
        .pipe(sourcemaps.init())
        .pipe(concat('vendor.js'))
        .pipe(gulpif(argv.minify, uglify()))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('front/dist/js/'));
});

gulp.task('js', ['js-app', 'js-libs']);

//
//   Common tasks
//
gulp.task('copy-img', function () {
    return gulp
        .src('front/assets/images/**/*.*')
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

gulp.task('install', [
    'copy-img',
    'copy-fonts',
    'js',
    'less',
    'jade'
]);

gulp.task('watch', function () {
    gulp.watch(['front/src/**/*.jade'], ['jade']);
    gulp.watch(['front/src/**/*.js'], ['js-app']);
    gulp.watch(['front/assets/images/**/*.*'], ['copy-images']);
    gulp.watch(['front/assets/styles/**/*.less'], ['less-app']);
});

//
//      Configuration task
//
gulp.task('configure', function(cb) {
    var schema = require('./config/.schema');

    prompt.start();
    prompt.get(schema, function(err, config) {
        if (err) { return cb(err) }

        config = expandConfig(config);
        // TODO: Update md5 module
        config.salt = config.salt == "auto" ? md5(Date.now()) : config.salt;
        config.salt = env == 'test' ? '' : config.salt;
        config.uploadDir = path.resolve(__dirname, `./${config.uploadDir}/`);

        config = deepExtend({
            mysql : { dialect : "mysql" }
        }, config);

        if (env == 'test') {
            config.mysql.dialectOptions = { multipleStatements : true }
        }

        fs.writeFile(`./config/${env}.json`, JSON.stringify(config, null, '    '), cb);
    });
});

//
//      Database related tasks
//
gulp.task('database', sequence('database-create', 'database-sync'));

gulp.task('database-create', function(cb) {
    var mysql = require('mysql');

    var config = require(`./config/${env}.json`).mysql;

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

gulp.task('database-sync', function(cb) {
    require('./app/app.js').get('models').sequelize
        .sync({ force : argv.force })
        .then(function(){ cb(); });
});

function expandConfig(config) {
    function namespace(str, root, value) {
        var chunks = str.split('.'),
            current = root;
        for(var i = 0; i < chunks.length-1; i++) {
            if (!current.hasOwnProperty(chunks[i])){
                current[chunks[i]] = {};
            }
            current = current[chunks[i]];
        }
        current[chunks.pop()] = value;
    }

    var opts = {};
    for (var p in config) if (config.hasOwnProperty(p)) { namespace(p, opts, config[p]) }
    return opts;
}