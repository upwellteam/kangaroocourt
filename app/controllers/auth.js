var debug = require('debug')('kangaroo:controller:auth');

var router = require('express').Router(),
    Promise = require('bluebird'),
    uuid = require('uuid').v4,
    request = Promise.promisify(require('request'));

var authenticate = require('../middleware/auth.js'),
    errors = require('../errors');

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
            console.log(user);
            res.json({
                token : token,
                user : {
                    id : user.id,
                    name : user.name,
                    email : user.email,
                    firstName : user.firstName,
                    imgUrl : user.imgUrl
                }
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

    models.RefreshToken
        .find({ where : { refresh : req.body.refresh_token } })
        .then(function(token) {
            if (!token) {
                throw errors.NotFoundError('invalid_refresh_token');
            }

            return token.regenerate();
        })
        .then(function(token) {
            res.json(token);
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

/**
 *
 */
router.post('/intro', authenticate(), function(req, res, next) {
    debug('[POST] /intro');

    var models = res.app.get('models'),
        state = req.body.state,
        user = res.locals.user;

    models.Intro
        .create({
            state : state,
            UserId : user.id
        })
        .then(function(Intro){
            res.status(201).json(Intro);
        })
        .catch(function(err){
            debug(err);
            res.status(500).json({ error : 'internal'});
        })
});

/**
 *
 */
router.get('/intro', authenticate(), function(req, res, next) {
    debug('[GET] /intro');

    var models = res.app.get('models'),
        user = res.locals.user;

    models.Intro
        .findOne({
            where : { UserId : user.id},
            order : 'createdAt DESC'
        })
        .then(function(Intro) {
            res.json(Intro);
        })
        .catch(errors.NotFoundError, function(err){
            res.status(404).json({ error : err.message });
        })
        .catch(function(err){
            debug(err);
            res.status(500).json({ error : 'internal'});
        })
});

module.exports = router;