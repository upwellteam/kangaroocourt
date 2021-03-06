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