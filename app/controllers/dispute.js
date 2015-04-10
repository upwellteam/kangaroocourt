var debug = require('debug')('kangaroo:dispute'),

    router = require('express').Router(),
    utils = require('../utils'),
    path = require('path');

var authMiddleware = require('../middleware/auth.js');
/**
 *
 */
router.post('/disputes/', authMiddleware, function(req, res) {
    debug('POST /disputes/');
    var models = res.app.get('models');
    var data = req.body;

    if (req.files.image) {
        data.imgUrl = path.relative(`${__dirname}/../../`, req.files.image.path);
    } else data.imgUrl = 'no_image';

    data.activeUntil = (new Date()).setDate((new Date()).getDate()+7);

    // TODO: проверка наличия plaintiff в базе данных
    models.Dispute
        .create(data)
        .then(function(dispute) {
            debug('dispute created');
            res.redirect('/disputes/'+dispute.id);
        })
        .catch(function(err){
            debug(err);
            res.status(500).json({ error : 'internal err'});
        });
});
/**
 *
 */
router.get('/disputes/', function(req, res) {
    debug('GET /disputes');
    var models = res.app.get('models');

    var page = req.query.page || 1;

    models.Dispute
        .findAll({
            where : req.query.type ? { type : req.query.type } : {},
            limit : 5,
            offset : (page-1) * 3,
            order : 'createdAt DESC'
        })
        .then(function(dispute) {
            res.json(dispute)
        })
        .catch(function(err){
            debug(err);
            res.status(500).json({ error : 'internal'})
        })
});
/**
 *
 */
router.get('/user/:id', function(req, res) {
    debug('GET /user/:id');
    var models = res.app.get('models'),
        user = req.params.id,
        page = req.query.page || 1;

    models.Dispute
        .findAll({
            where : { defendantId : user },
            limit : 5,
            offset : (page-1) * 3,
            order : 'createdAt DESC'
        })
        .then(function(dispute) {
            res.json(dispute)
        })
        .catch(function(err){
            debug(err);
            res.status(500).json({ error : 'internal'})
        })
});
/**
 *
 */
router.get('/disputes/:id', function(req, res) {
    debug('GET /disputes/:id');
    var models = res.app.get('models');
    var id = req.params.id;

    models.Dispute
        .find({
            where : { id : id },
            include : [
                { model: models.User, as : 'defendant' },
                { model: models.User, as : 'plaintiff' },
                models.Argument,
                models.Jury
            ]
        })
        .then(function(dispute) {
            if (!dispute) {
                throw new utils.NotFoundError('no_such_dispute');
            }
            res.json(dispute.toJSON());
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