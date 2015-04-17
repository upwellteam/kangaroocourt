var debug = require('debug')('kangaroo:dispute');

var router = require('express').Router(),
    utils = require('../utils'),
    path = require('path');

var ROOT = path.resolve(`${__dirname}/../../`);

var authMiddleware = require('../middleware/auth.js');
/**
 *
 */
router.post('/disputes/', authMiddleware, function(req, res) {
    debug('POST /disputes/');

    var models = res.app.get('models'),
        data = req.body,
        user = res.locals.user;

    models.User
        .find({ where : { email : data.defendant.email } })
        .then(function(defendant) {
            return models.Dispute
                .create({
                    bet: data.bet,
                    name: data.name,
                    description: data.description,
                    email: data.defendant.email,
                    category: data.category,
                    activeUntil : (new Date()).setDate((new Date()).getDate()+7),
                    imgUrl : req.files.image
                        ? path.relative(`${ROOT}`, req.files.image.path)
                        : null,
                    PlaintiffId : user.id,
                    DefendantId : defendant ? defendant.id : null
                })
        })
        .then(function(dispute) {
            debug('dispute created');
            res.status(201).send(dispute);
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

    models.Dispute
        .findAll({
            where : req.query.category ? { category : req.query.category } : {},
            include : [
                { model: models.User, as : 'Defendant' },
                { model: models.User, as : 'Plaintiff' },
                models.Argument,
                models.Jury
            ],
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
        user = req.params.id;

    models.Dispute
        .findAll({
            where : { PlaintiffId : user },
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

    var models = res.app.get('models'),
        id = req.params.id;

    models.Dispute
        .find({
            where : { id : id },
            include : [
                { model: models.User, as : 'Defendant' },
                { model: models.User, as : 'Plaintiff' },
                models.Argument,
                models.Jury
            ]
        })
        .then(function(dispute) {
            if (!dispute) {
                throw new utils.NotFoundError('no_such_dispute');
            }
            res.json(dispute);
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
router.delete('/disputes/:id', function(req, res) {
    debug('DELETE /disputes/:id');

    var models = res.app.get('models'),
        id = req.params.id;

    models.Dispute
        .destroy({
            where : { id : id }
        })
        .then(function(){
            res.status(200).send('success')
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
// TODO: router.put();
/**
 *
 */
module.exports = router;