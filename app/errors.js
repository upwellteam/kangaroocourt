var debug = require('debug')('kangaroo:api:errors');

var Sequelize = require('sequelize');

var utils = require('./utils');

module.exports = function(err, req, res, next) {
    debug(`Error with ${req.url}`);

    switch (Object.getPrototypeOf(err)) {
        case InvalidInputError.prototype :
            res.status(400).json({ error : err.message });
            break;
        case NotFoundError.prototype :
            res.status(404).json({ error : err.message });
            break;
        case NotAllowedError.prototype :
            res.status(403).json({ error : err.message });
            break;
        case Sequelize.ValidationError.prototype :
            res.status(400).json({
                error : 'validation',
                details : err.errors
            });
            break;
        case Sequelize.UniqueConstraintError.prototype :
            res.status(403).json({ error : 'already_exists' });
            break;
        default :
            debug(`Unexpected error at '${req.url}':`);
            debug(err);
            res.status(500).json({ error : 'internal' });
    }
};

/**
 *
 */
function NotFoundError(message) {
    if (! (this instanceof NotFoundError)) {
        return new NotFoundError(message);
    }

    this.name = 'NotFoundError';
    this.message = message;
}

NotFoundError.prototype = Object.create(Error.prototype);
NotFoundError.prototype.constructor = NotFoundError;

module.exports.NotFoundError = NotFoundError;

/**
 *
 */
function NotAllowedError(message) {
    if (! (this instanceof NotAllowedError)) {
        return new NotAllowedError(message);
    }

    this.name = 'NotAllowedError';
    this.message = message;
}

NotAllowedError.prototype = Object.create(Error.prototype);
NotAllowedError.prototype.constructor = NotAllowedError;

module.exports.NotAllowedError = NotAllowedError;

/**
 *
 */
function InvalidInputError(message) {
    if (! (this instanceof InvalidInputError)) {
        return new InvalidInputError(message);
    }

    this.name = 'InvalidInputError';
    this.message = message;
}

InvalidInputError.prototype = Object.create(Error.prototype);
InvalidInputError.prototype.constructor = InvalidInputError;

module.exports.InvalidInputError = InvalidInputError;