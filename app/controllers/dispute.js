var debug = require('debug')('kangaroo:dispute');

var router = require('express').Router(),
    jade = require('jade'),
    utils = require('../utils');

var authMiddleware = require('../middleware/auth.js');

var disputeTemplate = jade.compileFile(`${__dirname}/../templates/invitation.jade`);
/**
 *
 */
router.post('/disputes/', authMiddleware, function(req, res) {
    debug('POST /disputes/');

    var models = res.app.get('models'),
        mandrill = res.app.get('mandrill'),
        data = req.body,
        user = res.locals.user;

    var gDefendant, gDispute;

    models.User
        .find({ where : { email : data.defendant.email } })
        .then(function(defendant) {
            gDefendant = defendant;

            return models.Dispute
                .create({
                    bet: data.bet,
                    name: data.name,
                    description: data.description,
                    isPrivate: data.isPrivate,
                    defendantEmail: data.defendant.email,
                    category: data.category,
                    activeUntil : (new Date()).setDate((new Date()).getDate()+7),
                    imgUrl : 'images/img-1.png',
                    PlaintiffId : user.id,
                    DefendantId : defendant ? defendant.id : null
                })
        })
        .then(function(dispute) {
            debug('dispute created');
            res.status(201).send(dispute);
            gDispute = dispute;

            if(!gDefendant) {
                debug('creating invite');
                return models.Invitation.create({
                    DisputeId : gDispute.id,
                    type : 'defendant',
                    email: data.defendant.email
                })
            }

            return new Promise(function(resolve){ resolve(); })
        })
        .then(function(invitation){
            return mandrill('/messages/send', {
                message: {
                    to: [{
                        email: data.defendant.email,
                        name: gDefendant ? gDefendant.name : data.defendant.email
                    }],
                    from_email: 'noreply@kangaroocourt.com',
                    subject: `Invitation to dispute "${gDispute.name}" `,
                    html: disputeTemplate({
                        user : user,
                        dispute : gDispute,
                        invitation : invitation ? invitation.code : null
                    })
                }
            });
        })
        .then(function() {
            debug('mail sent');
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
            where : req.query.category ? {
                category : req.query.category,
                isPrivate : 0} : { isPrivate : 0},
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
router.get('/disputes/my', authMiddleware, function(req, res) {
    debug('GET /disputes/my');

    var models = res.app.get('models'),
        user = res.locals.user;

    var disputesJury = [],
        disputes = {};

    models.Jury
        .findAll({
            where : { UserId : user.id },
            order : 'createdAt DESC'
        })
        .then(function(jury) {
            jury.forEach(function(jury){
                disputesJury.push(jury.DisputeId);
            });
            return models.Dispute
                .findAll({
                    where : { id : disputesJury },
                    include : [
                        { model: models.User, as : 'Defendant' },
                        { model: models.User, as : 'Plaintiff' },
                        models.Jury
                    ],
                    order : 'createdAt DESC'
                })
        })
        .then(function(data){
            disputes.judging = data;

            return models.Dispute
                .findAll({
                    where : {
                        $or : [
                            { PlaintiffId : user.id },
                            { DefendantId : user.id }
                        ]},
                    include : [
                        { model: models.User, as : 'Defendant' },
                        { model: models.User, as : 'Plaintiff' },
                        models.Jury
                    ],
                    order : 'createdAt DESC'
                })
        })
        .then(function(data) {
            disputes.my = data;
            res.json(disputes)
        })
        .catch(function(err){
            debug(err);
            res.status(500).json({ error : 'internal'})
        })
});
/**
 *      // TODO: check for privacy
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
                { model: models.Comment, include : [{ model: models.User }] },
                { model: models.Jury, include : [{ model: models.User }] },
                models.Argument
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