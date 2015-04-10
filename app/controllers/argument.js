var debug = require('debug')('kangaroo:vote'),

    router = require('express').Router(),
    utils = require('../utils');
/**
 *
 */
router.post('/argument', function(req, res) {
    var models = res.app.get('models');

    var data = req.body;

    models.Argument
        .create(data)
        .then(function(Argument){
            res.status(201).json(Argument.toJSON());
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
