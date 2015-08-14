var debug = require('debug')('kangaroo:controller:auth');

var router = require('express').Router(),
    Promise = require('bluebird'),
    uuid = require('uuid').v4,
    request = Promise.promisify(require('request'));

var authenticate = require('../middleware/auth.js'),
    errors = require('../errors'),
    utils = require('../utils');

/**
 *
 */
router.post('/oauth/facebook', function(req, res, next) {
    debug(`GET /oauth/facebook`);

    var app = res.app,
        models = app.get('models'),
        credentials = app.get('config').facebook;

    var code = req.query.code,
        token = req.query.token,
        invitation = req.query.invitation;

    var profileData, user;

    new Promise(function(resolve) {
        if (token) {
            return resolve(token);
        }

        if (code) {
            request({
                uri : 'https://graph.facebook.com/v2.3/oauth/access_token',
                method : 'get',
                qs : {
                    'code' : code,
                    'client_id' : credentials.client_id,
                    'client_secret' : credentials.client_secret,
                    'redirect_uri' : credentials.redirect_uri,
                    'json' : true
                }
            })
                .spread(function(response, body) {
                    body = JSON.parse(body);

                    if (!! body.error) { throw new Error(body.error.message) }

                    resolve(body.access_token);
                })
        }

        //throw errors.InvalidInputError('token_or_code_required');
    })
        .then(function(token) {
            return request({
                uri : 'https://graph.facebook.com/me',
                method : 'get',
                qs : { access_token : token }
            });
        })
        .spread(function(response, body) {
            debug('user info received');
            profileData = JSON.parse(body);

            if (!! body.error) { throw new Error(body.error.message) }

            return models.User.find({
                where : { email : profileData.email }
            });
        })
        .then(function(entity){
            if (entity) {
                return Promise.resolve({ user : entity });
            }
            return models.User.register({
                name : profileData.name,
                email : profileData.email,
                firstName : profileData.first_name,
                imgUrl : 'https://graph.facebook.com/'+profileData.id+'/picture?type=large'
            })
        })
        .then(function(result) {
            return user = result.user;
        })
        .then(function(){
            if (invitation != null) {
                return models.Invitation
                    .find({ where : { code : invitation } })
                    .then(function(invitation) {
                        debug('handling invitation');

                        return invitation
                            ? invitation.handle(user)
                            : new Promise(function(resolve){ resolve(); });
                    })
            }
            return new Promise(function(resolve){ resolve(); })
        })
        .then(function() {
            return user.generateToken();
        })
        .then(function(token){
            res.json({
                token : token,
                user : user.toJSON()
            });
        })
        .catch(function(err){
            debug('err happened');
            console.log(err);
            res.status(500).send(err);
        });
});

/**
 *
 */
router.post('/refresh-token', function(req, res, next) {
    debug('POST /refresh-token');

    var models = res.app.get('models');

    console.log(req.body);
    // TODO: req.body doesnt contain refresh_token

    models.RefreshToken
        .find({ where : { refresh : req.body.refresh_token } })
        .then(function(token) {
            if (!token) {
                throw utils.NotFoundError('invalid_refresh_token');
            }

            return token.regenerate();
        })
        .then(function(token) {
            res.json({ token : token });
        })
        .catch(next)
});

/**
 *
 */
router.get('/logout', authenticate(), function(req, res, next) {
    debug('GET /logout');

    var models = res.app.get('models'),
        redis = res.app.get('redis'),
        token = res.locals.accessToken;

    models.RefreshToken
        .destroy({ where : { access : token } })
        .then(function() {
            return redis.del(token)
        })
        .then(function() {
            res.status(200).json({ status : 'ok' });
        })
        .catch(next)
});

module.exports = router;