var debug = require('debug')('kangaroo:controller:comments');

var router = require('express').Router();

var authenticate = require('../middleware/auth.js'),
    errors = require('../errors'),
    utils = require('../utils');

/**
 *
 */
router.post('/comments', authenticate(), function(req, res) {
    debug('POST /comments');

    var models = res.app.get('models'),
        data = req.body,
        user = res.locals.user;

    models.Comment
        .create({
            text : data.text,
            DisputeId : data.dispute,
            UserId : user.id
        })
        .then(function(Comment){
            res.status(201).json(Comment);
        })
        .catch(function(err){
            debug(err);
            res.status(500).json({ error : 'internal'});
        })
});

/**
 *  @example: /comments?dispute=:disputeId
 */
router.get('/comments', function (req, res) {
    debug('GET /comments');

    var models = res.app.get('models'),
        disputeId = req.query.dispute;

    models.Comment
        .findAll({
            where : { DisputeId : disputeId },
            order : 'createdAt DESC'
        })
        .then(function(Comment) {
            res.json(Comment);
        })
        .catch(errors.NotFoundError, function(err){
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
router.delete('/comments/:id', function(req, res) {
    debug('DELETE /comments/:id');

    var models = res.app.get('models'),
        id = req.params.id;

    models.Comment
        .destroy({
            where : { id : req.params.id }
        })
        .then(function(){
            res.status(200).send('comment successfully deleted')
        })
        .catch(errors.NotFoundError, function(err){
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

