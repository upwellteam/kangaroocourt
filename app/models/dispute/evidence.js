var debug = require('debug')('kangaroo:models:dispute:evidence');

var path = require('path'),
    Promise = require('bluebird'),
    async = require('async');

var utils = require('../../utils');

/**
 *
 */
module.exports = function(sequelize, DataTypes) {
    var Evidence = sequelize.define('Evidence', {
        basename: {
            type: DataTypes.STRING(128),
            allowNull: false
        },
        filename: {
            type: DataTypes.STRING(128),
            allowNull: false
        },
        path : {
            type : DataTypes.VIRTUAL,
            get : function() {
                return `/uploads/${this.filename}`
            }
        },
        absolutePath : {
            type: DataTypes.STRING(128),
            allowNull: false
        }
    }, {
        classMethods : {
            associate : function(models) {
                models.Evidence.belongsTo(models.Dispute);
                models.Evidence.belongsTo(models.User, {
                    as : 'Uploader'
                });
            },
            countEvidence : function(user) {
                var query = `SELECT count(*) AS total FROM Evidence
                             WHERE Evidence.UploaderId = :userId`;

                return new Promise(function(resolve, reject) {
                    sequelize
                        .query(query, {
                            replacements : { userId: user.id },
                            type : sequelize.QueryTypes.SELECT
                        })
                        .then(function(result) {
                            resolve(result[0].total);
                        })
                        .catch(reject);
                });
            }
        },
        instanceMethods : {}
    });

    return Evidence;
};