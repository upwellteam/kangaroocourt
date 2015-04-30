var debug = require('debug')('kangaroo:poligon');

var extend = require('extend'),
    router = require('express').Router(),
    utils = require('../utils');
/**
 *
 */
router.get('/poligon', function(req, res) {
    var models = res.app.get('models');

    var gUser;

    models.User
        .create({
            name : 'Bar Baz',
            email : 'foobarbaz@gmail.com',
            firstName : 'Baz'
        })
        .then(function(user){
            gUser = user;

            return models.Invitation.find({
                where : { id : req.query.invite }
            })
        })
        .then(function(invitation){
            return invitation.handle(gUser);
        })
        .then(function(){
            console.log('success');
        })
        .catch(function(err){
            res.send(err);
            console.log(err);
        })

});

module.exports = router;
