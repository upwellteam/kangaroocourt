var underscore = require('underscore');

module.exports.capitalize = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

module.exports.pick = function(object, properties) {
    return underscore.pick(object, properties.split(' '));
};

/**
 *
 */
function NotFoundError(message) {
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
    this.name = 'NotAllowedError';
    this.message = message;
}

NotAllowedError.prototype = Object.create(Error.prototype);
NotAllowedError.prototype.constructor = NotAllowedError;

module.exports.NotAllowedError = NotAllowedError;