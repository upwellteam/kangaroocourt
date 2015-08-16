var fs = require('fs'),
    path = require('path'),
    extend = require('extend'),
    underscore = require('underscore');

module.exports.extend = extend;

module.exports.capitalize = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

module.exports.pick = function(object, properties) {
    return underscore.pick(object, properties.split(' '));
};

/**
 * Temporary. Delete every error
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

/**
 *
 */
module.exports.readdirRecursiveSync = function(directory) {
    var result = [];
    readdir(directory);
    return result;

    function readdir(current) {
        var files = fs.readdirSync(current);

        files.forEach(function(file) {
            var absViam = path.resolve(current, file),
                stat = fs.statSync(absViam);

            if (stat.isFile()) {
                result.push(path.relative(directory, absViam));
            }

            if (stat.isDirectory()) {
                readdir(absViam);
            }
        })
    }
};