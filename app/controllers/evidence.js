const MAX_EVIDENCE_COUNT = 3;

var debug = require('debug')('kangaroo:controllers:evidence');

var router = require('express').Router(),
    mkdirp = require('mkdirp'),
    path = require('path');

var app = require('../app.js'),
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
router.post('/dispute/evidence', authenticate(), upload.array('photo', 12), function(req, res, next) {
    debug('[POST] /dispute/evidence');
    // TODO: authentication doesnt work

    var models = res.app.get('models'),
        data = req.body,
        user = res.locals.user;

    var files = req.files;

    if (!files) {
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
            if (evidenceCount >= MAX_EVIDENCE_COUNT) {
                throw new errors.NotAllowedError('max_evidence_limit');
            }

            return files.forEach(function(file){
                models.Evidence
                    .create({
                        basename : file.originalname,
                        filename : file.filename,
                        DisputeId : data.disputeId,
                        UploaderId : user.id
                    });
            })
        })
        .then(function(image) {
            res.status(201).send(image);
        })
        .catch(next);
});

module.exports = router;