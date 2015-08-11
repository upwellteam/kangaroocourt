const MAX_INVITE_PER_SIDE = 5;

var debug = require('debug')('kangaroo:controller:jury');

var router = require('express').Router(),
    jade = require('jade');

var authenticate = require('../middleware/auth.js'),
    errors = require('../errors'),
    utils = require('../utils'),
    disputeTemplate = jade.compileFile(`${__dirname}/../templates/juryInvitation.jade`);

/**
 *
 */
router.post('/jury/invite', authenticate(), function(req, res) {
    debug('POST /jury/invite');

    var models = res.app.get('models'),
        mandrill = res.app.get('mandrill'),
        data = req.body,
        user = res.locals.user;

    var side, gDispute, gJuryUser, gInvite;

    models.Dispute
        .find({
            where : { id : data.dispute },
            include : [
                {
                    model: models.Jury,
                    include : [
                        { model: models.User },
                        { model: models.Invitation, as : 'Invite' }
                    ]
                }
            ]
        })
        .then(function(dispute) {
            gDispute = dispute;

            if (!dispute) {
                throw new errors.NotFoundError('no such dispute');
            }
            if (user.id != dispute.PlaintiffId && user.id != dispute.DefendantId) {
                throw new errors.NotAllowedError('not allowed to invite');
            }

            (user.id == dispute.PlaintiffId) && (side = 'plaintiff');
            (user.id == dispute.DefendantId) && (side = 'defendant');

            // TODO: Check this
            var invitedCount = dispute.Juries.filter(function(jury) { return jury.side == side }).length;

            if (invitedCount >= MAX_INVITE_PER_SIDE) {
                throw new errors.NotAllowedError('your jury bench is full already');
            }

            return models.User.find({ where : { email : data.email } })
        })
        .then(function(user) {
            gJuryUser = user;
            if (!user) {
                return models.Invitation.create({
                    type : 'jury',
                    email: data.email
                })
            }
            return new Promise(function(resolve){ resolve(); })
        })
        .then(function(invite){
            gInvite = invite;

            return models.Jury
                .create({
                    side : side,
                    DisputeId : gDispute.id,
                    UserId : gJuryUser ? gJuryUser.id : null,
                    InviteId : invite ? invite.id : null
                });
        })
        .then(function(jury) {
            res.status(201).json(jury);

            return mandrill('/messages/send', {
                message: {
                    to: [{
                        email: data.email,
                        name: data.email
                    }],
                    from_email: 'noreply@kangaroocourt.com',
                    subject: `Invitation to dispute "${gDispute.name}" `,
                    html: disputeTemplate({
                        user: user,
                        dispute: gDispute,
                        invitation: gInvite ? gInvite.code : null
                    })
                }
            });
        })
        .then(function(){
            debug('email sent');
        })
        .catch(errors.NotFoundError, function(err){
            res.status(404).json({ error : err.message });
        })
        .catch(errors.NotAllowedError, function(err){
            res.status(403).json({ error : err.message });
        })
        .catch(function(err){
            debug(err);
            res.status(500).json({ error : 'internal err'});
        });
});

/**
 *
 */
router.post('/jury/vote', authenticate(), function(req, res) {
    debug('POST jury/vote');

    var models = res.app.get('models'),
        user = res.locals.user,
        data = req.body;

    // TODO: isvoted

    models.Jury
        .find({ where : { disputeId : data.dispute, userId : user.id } })
        .then(function(jury){
            jury.setDataValue('vote', data.vote);
            return jury.save();
        })
        .then(function(votes) {
            res.json(votes)
        })
        .catch(function(err){
            debug(err);
            res.status(500).json({ error : 'internal'})
        })
});

/**
 *
 */
router.get('/votes/:disputeId', authenticate(), function(req, res) {
    debug('GET /votes/:disputeId');

    var models = res.app.get('models');

    models.Jury
        .findAll({
            where : { DisputeId : req.params.disputeId },
            order : 'createdAt DESC'
        })
        .then(function(votes) {
            res.json(votes)
        })
        .catch(function(err){
            debug(err);
            res.status(500).json({ error : 'internal'})
        })
});

module.exports = router;