var redis = require('then-redis');

var config = require('./app.js').get('config').redis;

module.exports = redis.createClient(config);