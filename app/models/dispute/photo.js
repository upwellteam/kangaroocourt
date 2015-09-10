var debug = require('debug')('kangaroo:models:dispute:photo');

/**
 *
 */
module.exports = function(sequelize, DataTypes) {
    var DisputesPhoto = sequelize.define('DisputesPhoto', {
        basename: {
            type: DataTypes.STRING(128),
            allowNull: false
        },
        filename: {
            type: DataTypes.STRING(128),
            allowNull: false
        },
        path : {
            type: DataTypes.STRING(128),
            allowNull: false
        },
        absolutePath : {
            type: DataTypes.STRING(128),
            allowNull: false
        }
    }, {
        classMethods : {
            associate : function(models) {
                models.DisputesPhoto.belongsTo(models.Dispute);
            }
        },
        instanceMethods : {}
    });

    return DisputesPhoto;
};