var debug = require('debug')('kangaroo:models');

var extend    = require('extend'),
    Sequelize = require("sequelize");

var app = require('./app.js'),
    utils = require('./utils'),
    root = app.get('root'),
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
utils.readdirRecursiveSync(`${root}/app/models`)
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