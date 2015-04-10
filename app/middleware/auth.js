var debug = require('debug')('kangaroo:middleware:auth');

module.exports = function authorize(req, res, next) {
    debug('authenticating');
    var redis = res.app.get('redis');

    if (!('token' in req.cookies) && !('token' in req.query)) {
        debug('no token');
        return res.status(403).send('unauthorized access');
    }

    var token = req.cookies.token || req.query.token;


    redis
        .exists(token)
        .then(function(result){
            if (!result) {
                throw new Error('unauthorized access');
            }

            return redis.get(token);
        })
        .then(function(result){
            res.locals.user = JSON.parse(result);
            next();
        })
        .catch(function(err){
            debug(err);
            res.status(500).send('server error');
        });
};