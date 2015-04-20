var debug = require('debug')('kangaroo:api');

var express = require('express'),
    fs = require('fs'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    redis = require('then-redis'),
    mandrill = require('node-mandrill'),
    bluebird = require('bluebird'),
    multer = require('multer');


var app = module.exports = express(),
    config = require('./configure');

var redisCon = redis.createClient({
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password
});

app.set('root', path.resolve(__dirname, './../'));
app.set('config', config);
app.set('models', require('./models.js'));
app.set('redis', redisCon);
app.set('mandrill', bluebird.promisify(mandrill(config.mandrill.key)) );

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.use(multer({ dest: `${__dirname}/../uploads/`}));

if (app.get('env') == 'development') {
    app.use(function(req, res, next) {
        debug(req.url);
        next();
    })
}

fs
.readdirSync(__dirname + '/controllers')
.forEach(function(ctrl){
    ctrl = require(__dirname + '/controllers/' + ctrl);
    app.use(ctrl);
});

app.post('/echo', function (req, res) {
    res.json(req.body);
});
