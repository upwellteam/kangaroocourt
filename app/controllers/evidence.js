var debug = require('debug')('kangaroo:controllers:evidence');

var router = require('express').Router(),
    mkdirp = require('mkdirp'),
    path = require('path'),
    Promise = require('bluebird'),
    fs = Promise.promisifyAll(require('fs'));;

var app = require('../app.js'),
    config = app.get('config'),
    authenticate = require('../middleware/auth.js'),
    errors = require('../errors'),
    utils = require('../utils');

var multer  = require('multer'),
    uploadDir = path.resolve(app.get('config').uploadDir),
    upload = multer({ dest: uploadDir });

debug(`upload folder: {APP}:${path.relative(app.get('root'), uploadDir)}`);
mkdirp.sync(uploadDir);

/**
 *
 */
router.post('/dispute/evidence', authenticate(), upload.array('evidence', config.MAX_EVIDENCE), function(req, res, next) {
    debug('[POST] /dispute/evidence');

    var models = res.app.get('models'),
        data = req.body,
        user = res.locals.user;

    var file = req.files[0];

    if (!file) {
        throw errors.InvalidInputError('photos_required');
    }

    models.User
        .find({
            where : { id : user.id }
        })
        .then(function(result) {
            user = result;
            return models.Evidence.countEvidence(user);
        })
        .then(function(evidenceCount) {
            if (evidenceCount >= config.MAX_EVIDENCE) {
                throw new errors.NotAllowedError('max_evidence_limit');
            }

            return models.Evidence
                .create({
                    basename : file.originalname,
                    filename : file.filename,
                    absolutePath : file.path,
                    DisputeId : data.disputeId,
                    UploaderId : user.id
                })
        })
        .then(function(result) {
            res.status(201).send(result);
        })
        .catch(next);
});

/**
 *
 */
router.delete('/dispute/evidence/:id', authenticate(), function(req, res) {
    debug('[DELETE] /dispute/evidence' + req.params.id);

    var models = res.app.get('models'),
        user = res.locals.user,
        img;

    models.Evidence
        .find({
            where : { id : req.params.id },
            include : [ models.Dispute ]
        })
        .then(function(image) {
            img = image;
            console.log(image.toJSON());
            if (!image) {
                throw new errors.NotFoundError('no_such_image')
            }
            if (image.UploaderId !== user.id) {
                throw new errors.NotAllowedError('not_allowed')
            }
            return fs.unlinkSync(image.absolutePath);
        })
        .then(function(){
            return models.Evidence
                .destroy({
                    where : { id : req.params.id }
                })
        })
        .then(function(){
            res.status(200).send('successfully removed')
        })
        .catch(errors.NotFoundError, function(err){
            res.status(404).json({ error : err.message });
        })
        .catch(errors.NotAllowedError, function(err) {
            res.status(403).send({ error : err.message })
        })
        .catch(function(err) {
            debug(err);
            res.status(500).json({ error : 'internal' });
        });
});

/**
 *
 */
router.post('/dispute/photo', authenticate(), upload.array('photo', 1), function(req, res, next) {
    debug('[POST] /disputes/photo');

    var models = res.app.get('models'),
        data = req.body,
        user = res.locals.user;

    var file = req.files[0];
    if (!file) {
        throw errors.InvalidInputError('photo_required');
    }
    console.log(uploadDir+file.path);
    models.DisputesPhoto
        .create({
            basename : file.originalname,
            filename : file.filename,
            absolutePath : file.path,
            path : '/uploads/' + file.filename,
            DisputeId : data.disputeId
        })
        .then(function(result) {
            res.status(201).send(result);
        })
        .catch(next);
});

module.exports = router;