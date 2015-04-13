var debug = require('debug')('kangaroo:argument');

var extend = require('extend'),
    router = require('express').Router(),
    utils = require('../utils');

var authMiddleware = require('../middleware/auth.js');

/**
 *
 */
router.post('/argument', authMiddleware, function(req, res) {
    debug('POST /argument');
    var models = res.app.get('models');

    var data = req.body;
    debug('incoming data:');
    console.log(data);

    var user = res.locals.user;
    debug('user:');
    console.log(user);


    models.Dispute
        .find({ where : { id : data.dispute } })
        .then(function(dispute){
            if (!dispute) {
                throw new utils.NotFoundError(`no dispute with id = ${data.dispute}`)
            }

            switch (user.id) {
                case dispute.DefendantId :
                    data.role = 'defendant';
                    break;
                case dispute.PlaintiffId :
                    data.role = 'plaintiff';
                    break;
                default :
                    throw new utils.NotAllowedError(`not allowed`)
            }

            // TODO: Check argument for existance for current participant
            return models.Argument.create({
                    argument : data.argument,
                    role : data.role,
                    DisputeId : data.dispute,
                    UserId : user.id
                })
        })
        .then(function(Argument){
            res.status(201).json(Argument);
        })
        .catch(function(err){
            debug(err);
            res.status(500).json({ error : 'internal'});
        })
});
/**
 *
 */
router.get('/argument/:id', function(req, res) {
    var models = res.app.get('models');
    var id = req.params.id;

    models.Argument
        .findAll({
            where : { disputeId : id },
            order : 'createdAt DESC'
        })
        .then(function(vote) {
            res.json(vote);
        })
        .catch(utils.NotFoundError, function(err){
            res.status(404).json({ error : err.message });
        })
        .catch(function(err){
            debug(err);
            res.status(500).json({ error : 'internal'});
        })
});
/**
 *
 */
module.exports = router;
