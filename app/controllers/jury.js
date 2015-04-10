var debug = require('debug')('kangaroo:jury'),

    router = require('express').Router(),
    utils = require('../utils');
/**
 *
 */
router.post('/jury', function(req, res) {
    var models = res.app.get('models');

    var data = req.body;

    models.Jury
        .create(data)
        .then(function(Jury){
            res.status(201).json(Jury.toJSON());
        })
        .catch(function(err){
            debug(err);
            res.status(500).json({ error : 'internal'});
        })
});
/**
 *
 */
router.get('/jury/dispute/:id', function(req, res) {
    var models = res.app.get('models');
    var id = req.params.id;

    models.Jury
        .findAll({
            where : { DisputeId : id },
            order : 'createdAt DESC'
        })
        .then(function(jury) {
            res.json(jury);
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
router.get('/jury/user/:id', function(req, res) {
    var models = res.app.get('models');
    var id = req.params.id;

    models.Jury
        .findAll({
            where : { userId : id },
            order : 'createdAt DESC'
        })
        .then(function(jury) {
            res.json(jury);
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
