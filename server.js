require('dotenv').load({ silent: true });

var debug = require('debug')('kangaroo:server');

// Libraries
var express = require('express'),
    application = require('./app/app.js');

var server = express();

server.set('port', (process.env.PORT || 3000));
server.set('x-powered-by', false);

server.use(function(req, res, next){
    debug(req.url);
    next();
});

server.use('/api', application);
server.use('/uploads', express.static(`${__dirname}/uploads`));
server.use(express.static(`${__dirname}/front/dist`));
server.get([
    '/',
    '/oauth/:provider',
    '/disputes/list/',
    '/disputes/list/:category',
    '/disputes/:id',
    '/profile',
    '/profile/disputes',
    '/403',
    '/404'
], function(req, res) {
    res.sendFile(`${__dirname}/front/dist/index.html`);
});

server.use(function(req, res, next) {
    debug(`unresolved url: ${req.headers.host}${req.url}`);
    next();
});

server.listen(server.get('port'), function () {
    debug(`Server listening on port ${server.get('port')}`);
    debug('Environment is ' + application.get('env'));
});

module.exports = server;