var debug = require('debug')('kangaroo:controller:argument');

var router = require('express').Router();

var authenticate = require('../middleware/auth.js'),
    errors = require('../errors'),
    utils = require('../utils');

/**
 *
 */
router.post('/argument', authenticate(), function(req, res) {
    debug('[POST] /argument');
    var models = res.app.get('models');

    var data = req.body,
        user = res.locals.user;

    models.Dispute
        .find({ where : { id : data.disputeId } })
        .then(function(dispute){
            if (!dispute) {
                throw new errors.NotFoundError(`no dispute with id = ${data.disputeId}`)
            }

            switch (user.id) {
                case dispute.DefendantId :
                    data.role = 'defendant';
                    break;
                case dispute.PlaintiffId :
                    data.role = 'plaintiff';
                    break;
                default :
                    throw new errors.NotAllowedError(`not allowed`)
            }
            // TODO: Check argument for existance for current participant
            return models.Argument.create({
                    argument : data.argument,
                    role : data.role,
                    DisputeId : data.disputeId,
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
    debug('[GET] /argument/:id');
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
        .catch(errors.NotFoundError, function(err){
            res.status(404).json({ error : err.message });
        })
        .catch(function(err){
            debug(err);
            res.status(500).json({ error : 'internal'});
        })
});

module.exports = router;