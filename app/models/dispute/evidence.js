var debug = require('debug')('kangaroo:models:evidence');

var path = require('path'),
    Promise = require('bluebird'),
    async = require('async'),
    fs = Promise.promisifyAll(require('fs'));

var utils = require('../../utils');

/**
 *
 */
module.exports = function(sequelize, DataTypes) {
    var DisputesEvidence = sequelize.define('DisputesEvidence', {
        basename: {
            type: DataTypes.STRING(36),
            allowNull: false
        },
        width : {
            type : DataTypes.INTEGER.UNSIGNED,
            allowNull : true,
            defaultValue : null
        },
        height : {
            type : DataTypes.INTEGER.UNSIGNED,
            allowNull : true,
            defaultValue : null
        },
        path : {
            type : DataTypes.VIRTUAL,
            get : function() {
                return `/${this.basename}${this.extension}`
            }
        },
        absolutePath : {
            type: DataTypes.VIRTUAL,
            set : function(viam) {
                this.extension = path.extname(viam);
                this.basename = path.basename(viam, this.extension)
            }
        }
    }, {
        classMethods : {
            associate : function(models) {
                DisputesEvidence.belongsTo(models.Dispute);

                DisputesEvidence.belongsTo(models.User, {
                    as : 'Uploader'
                });
            },
            countEvidence : function(user) {
                var query = `SELECT count(*) AS total FROM DisputesEvidences
                             WHERE DisputesEvidences.UploaderId = :userId`;

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

    return DisputesEvidence;
};