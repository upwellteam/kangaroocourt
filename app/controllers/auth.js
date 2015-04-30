var debug = require('debug')('kangaroo:auth'),

    router = require('express').Router(),
    Promise = require('bluebird'),
    uuid = require('uuid').v4,
    request = Promise.promisify(require('request')),
    authMiddleware = require('../middleware/auth.js');

router.get('/oauth/:provider', function (req, res){
    debug('GET /oauth');
    if (! ~ ['facebook', 'google'].indexOf(req.params.provider)) {
        return res.status(501).json({error : 'unknown provider'});
    }

    var app = res.app,
        redis = app.get('redis'),
        models = app.get('models'),
        config = app.get('config'),
        credentials = config.credentials[req.params.provider];

    var code = req.query.code,
        invitation = req.query.invitation,
        gToken, gProfileData, gUser;

    request({
        uri : 'https://graph.facebook.com/v2.3/oauth/access_token',
        method : 'get',
        qs : {
            'code' : code,
            'client_id' : credentials.client_id,
            'client_secret' : credentials.client_secret,
            'redirect_uri' : credentials.redirect_uri
        }
    })
        .spread(function(response, body){
            var accessToken = JSON.parse(body).access_token;

            return request({
                uri : 'https://graph.facebook.com/me',
                method : 'get',
                qs : { access_token : accessToken }
            });
        })
        .spread(function(response, body){
            debug('user data obtained');

            gProfileData = JSON.parse(body);
            return models.User.find({ where : { email : gProfileData.email } })
        })
        .then(function(user){
            if (user) {
                return new Promise(function(done){ done(user); });
            }
            return models.User.create({
                name : gProfileData.name,
                email : gProfileData.email,
                firstName : gProfileData.first_name,
                imgUrl : 'https://graph.facebook.com/'+gProfileData.id+'/picture?type=large'
            })
        })
        .then(function(user){
            gUser = user;
            gToken = uuid();
            return redis.set(gToken, JSON.stringify(user));
        })
        .then(function(){
            return redis.expire(gToken, config.redis.lifetime);
        })
        .then(function(){
            if (invitation != null) {
                return models.Invitation
                    .find({ where : { code : invitation } })
                    .then(function(invitation) {
                        debug('handling invitation');

                        return invitation
                            ? invitation.handle(gUser)
                            : new Promise(function(resolve){ resolve(); });
                    })
            }
            return new Promise(function(resolve){ resolve(); })
        })
        .then(function(){
            debug(`sending token: ${gToken}`);
            res.json({
                token : gToken,
                user : gUser
            });
        })
        .catch(function(err){
            debug('err happened');
            console.log(err);
            res.status(500).send(err);
        });

});

router.get('/logout', authMiddleware, function(req, res){
    res.app.get('redis').del(req.query.token);
    res.json({ result : 'ok' })
});

module.exports = router;