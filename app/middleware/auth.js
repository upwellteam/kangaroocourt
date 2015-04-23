var debug = require('debug')('kangaroo:middleware:auth');

var utils = require('../utils');

module.exports = function authorize(req, res, next) {
    debug('authenticating');
    var redis = res.app.get('redis');

    if (!('token' in req.cookies) && !('token' in req.query)) {
        debug('no token');
        return res.status(403).json({ error : 'token_not_valid'});
    }

    var token = req.cookies.token || req.query.token;


    redis
        .exists(token)
        .then(function(result){
            if (!result) {
                throw new utils.NotAllowedError('token_not_valid');
            }

            return redis.get(token);
        })
        .then(function(result){
            res.locals.user = JSON.parse(result);
            next();
        })
        .catch(utils.NotAllowedError, function(err){
            res.status(403).json({error : err.message});
        })
        .catch(function(err){
            debug(err);
            res.status(500).json({ error : 'internal' });
        });
};