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

    var models = res.app.get('models');

    var data = req.body;

    console.log(data);

    var user = res.locals.user;

    // TODO: проверка наличия plaintiff в базе данных
    models.User
        .find({ where : { email : data.email } })
        .then(function(defendant) {
            return models.Dispute
                .create({
                    bet: data.bet,
                    name: data.name,
                    description: data.description,
                    email: data.defendantEmail,
                    type: data.type,
                    activeUntil : (new Date()).setDate((new Date()).getDate()+7),
                    imgUrl : req.files.image
                        ? path.relative(`${ROOT}`, req.files.image.path)
                        : 'no_image',
                    PlaintiffId : user.id,
                    DefendantId : defendant ? defendant.id : null
                })
        })
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
            include : [
                { model: models.User, as : 'Defendant' },
                { model: models.User, as : 'Plaintiff' },
                models.Argument,
                models.Jury
            ],
            limit : 4,
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
            where : { DefendantId : user },
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
module.exports = router;