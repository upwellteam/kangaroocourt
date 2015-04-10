// Debug
var debug = require('debug')('kangaroo:models');

// Libs
var fs        = require("fs"),
    path      = require("path"),
    extend    = require('extend'),
    Sequelize = require("sequelize");

var app = require('./app.js');

var root = app.get('root'),
    config = app.get('config').mysql;

var sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    extend(config, {
        logging : debug
    })
);

var models = {};

fs.readdirSync(`${root}/app/models`)
    .filter(function(file) {
        return (file.indexOf(".") !== 0);
    })
    .forEach(function(file) {
        var model = sequelize.import(`${root}/app/models/${file}`);
        models[model.name] = model;
    });

Object.keys(models).forEach(function(modelName) {
    if ("associate" in models[modelName]) {
        models[modelName].associate(models);
    }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;