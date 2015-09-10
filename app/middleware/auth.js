var debug = require('debug')('kangaroo:middleware:authenticate');

var Promise = require('bluebird');

var errors = require('../errors');

module.exports = function authenticateMiddlewareGenerator(options) {
    return function authenticate(req, res, next) {
        debug('auth started');

        var models = res.app.get('models'),
            redis = res.app.get('redis'),
            config = res.app.get('config'),
            token, user;

        if ((!"token" in req.query) || (!"authentication" in req.headers)) {
            debug('no token provided');
            return res.status(403).send({ 'error' : 'auth_required' });
        }

        res.locals.accessToken = token = req.query.token || req.headers.authentication;
        debug(`token: ${token}`);

        redis
            .get(token)
            .then(function (id) {
                var include = [];

                return models.User.findById(id, { include : include });
            })
            .then(function(entity) {
                if (!entity) {
                    throw errors.NotFoundError('token_not_valid');
                }

                user = res.locals.user = entity;
                debug(`auth success for ${user.name}`);

                return Promise.resolve();
            })
            .then(function(profile) {
                if (profile) {
                    res.locals.profile = profile;
                }
                next();
            })
            .catch(errors.NotAllowedError, function(err) {
                res.status(405).json({ error : err.message })
            })
            .catch(errors.NotFoundError, function(err) {
                res.status(401).json({ error : err.message })
            })
            .catch(function(err) {
                debug(err);
                console.log(err);
                res.status(500).json({ "error" : "internal" });
            });
    }
};
