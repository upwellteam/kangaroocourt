require('dotenv').load();

var express = require('express'),
	server = express(),
    application = require('./app/app.js');

server.set('port', (process.env.PORT || 5000));

server.use('/api', application);
server.use('/uploads', express.static(`${__dirname}/uploads`));
server.use(express.static(`${__dirname}/front/dist`));
server.use(function(req, res){
    res.sendFile(`${__dirname}/dist/index.html`)
});

server.listen(server.get('port'), function () {
	console.log('Running on ' + server.get('port'));
});

module.exports = app;
